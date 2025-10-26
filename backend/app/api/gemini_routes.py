import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import settings
from app.api.prompts import prompts

router = APIRouter()


class GeminiPromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt to send to Gemini")
    max_tokens: int | None = Field(
        default=None, ge=1, le=65536, description="Override max tokens for response"
    )
    duck: str | None = Field(
        default=None,
        description="Type of duck prompt to use: 'child', 'grad', 'prof', 'coding'",
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

    curr_prompt = ""
    if body.duck == "child":
        curr_prompt = "child_duck_prompt"
    elif body.duck == "grad":
        curr_prompt = "grad_duck_prompt"
    elif body.duck == "prof":
        curr_prompt = "prof_duck_prompt"
    elif body.duck == "coding":
        curr_prompt = "coding_duck_prompt"
    else:
        curr_prompt = "You are a helpful duck assistant."

    system_instruction = prompts.PROMPTS[curr_prompt]

    model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
    result = model.generate_content(body.prompt, generation_config=generation_config)  # type: ignore[arg-type]]
    
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

class SentimentResponse(BaseModel):
    sentiment: str


@router.post("/analyze_sentiment", response_model=SentimentResponse)
async def analyze_sentiment(body: GeminiPromptRequest) -> SentimentResponse:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    model_name = settings.GEMINI_MODEL
    generation_config: dict = {
        "max_output_tokens": body.max_tokens or settings.MAX_TOKENS,
        "temperature": 0.3,
    }
    
    system_instruction = prompts.PROMPTS.get("sentiment_analysis_prompt", "You are an expert sentiment analysis model, classify the understanding as Good, Poor, or Neutral in one word.")
    model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
    result = model.generate_content(body.prompt, generation_config=generation_config)  # type: ignore[arg-type]
    
    if not result.candidates:
        print("No candidates returned")
        return SentimentResponse(sentiment="Neutral")
    
    candidate = result.candidates[0]
    finish_reason = candidate.finish_reason
    
    print(f"Finish reason: {finish_reason}")
    
    # Only block on SAFETY (3), RECITATION (4), or OTHER (5)
    # STOP (1) and MAX_TOKENS (2) are both OK
    if finish_reason in [3, 4, 5]:
        print(f"Response blocked with finish_reason: {finish_reason}")
        return SentimentResponse(sentiment="Neutral")
    
    # For MAX_TOKENS, the content still exists, just truncated
    try:
        # Access the text from parts directly
        if candidate.content and candidate.content.parts:
            text = candidate.content.parts[0].text.strip()
        else:
            print("No content parts, using result.text accessor")
            text = result.text.strip()
        
        print(f"Raw sentiment response: '{text}'")
        
        sentiment = text.split()[0] if text else "Neutral"
        sentiment = sentiment.capitalize()
        
        if sentiment not in ["Good", "Neutral", "Poor"]:
            print(f"Unexpected sentiment value: '{sentiment}', defaulting to Neutral")
            sentiment = "Neutral"
        
        print(f"Final sentiment: {sentiment}")
        
    except Exception as e:
        print(f"Error extracting sentiment: {e}")
        sentiment = "Neutral"
    
    return SentimentResponse(sentiment=sentiment)