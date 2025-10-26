import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import settings

router = APIRouter()


class GeminiPromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt to send to Gemini")
    system: str | None = Field(
        default="You are a helpful assistant.", description="Optional system prompt"
    )
    max_tokens: int | None = Field(
        default=None, ge=1, le=65536, description="Override max tokens for response"
    )


class GeminiPromptResponse(BaseModel):
    text: str


@router.post("/gemini", response_model=GeminiPromptResponse)
async def prompt_gemini(body: GeminiPromptRequest) -> GeminiPromptResponse:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    model_name = settings.GEMINI_MODEL
    generation_config: dict = {
        "max_output_tokens": body.max_tokens or settings.MAX_TOKENS,
    }
    system_instruction = body.system or ""

    model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
    result = model.generate_content(body.prompt, generation_config=generation_config)  # type: ignore[arg-type]
    
    # Debug: Print the full result structure
    print(f"Prompt feedback: {result.prompt_feedback}")
    print(f"Candidates: {result.candidates}")
    
    # Check if the prompt itself was blocked
    if hasattr(result, 'prompt_feedback') and result.prompt_feedback.block_reason:
        print(f"Prompt blocked! Reason: {result.prompt_feedback.block_reason}")
        raise HTTPException(
            status_code=400,
            detail=f"Your prompt was blocked by safety filters. Reason: {result.prompt_feedback.block_reason}"
        )
    
    # Check if response was blocked or had issues
    if not result.candidates:
        raise HTTPException(
            status_code=400,
            detail="No response generated. The request may have been blocked by safety filters."
        )
    
    candidate = result.candidates[0]
    
    # Check finish reason
    finish_reason = candidate.finish_reason
    if finish_reason != 1:  # 1 = STOP (normal completion)
        # finish_reason: 1=STOP, 2=MAX_TOKENS, 3=SAFETY, 4=RECITATION, 5=OTHER
        reason_map = {
            2: "Response was cut off due to token limit",
            3: "Response was blocked by safety filters",
            4: "Response was blocked due to recitation",
            5: "Response stopped for other reasons"
        }
        error_msg = reason_map.get(finish_reason, "Response generation failed")
        
        # Log safety ratings for debugging
        if finish_reason == 3 and candidate.safety_ratings:
            print(f"Safety ratings: {candidate.safety_ratings}")
        
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Check if content exists
    if not candidate.content or not candidate.content.parts:
        raise HTTPException(
            status_code=400,
            detail="No content in response. Please try rephrasing your request."
        )
    
    # Extract text safely
    try:
        text = result.text
    except Exception as e:
        print(f"Error extracting text: {e}")
        raise HTTPException(
            status_code=400,
            detail="Failed to extract response text. The response may have been blocked."
        )
    
    return GeminiPromptResponse(text=text)