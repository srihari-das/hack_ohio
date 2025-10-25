import google.generativeai as genai
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.config import settings

router = APIRouter()


class GeminiPromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt to send to Gemini")
    system: str | None = Field(
        default="You are a helpful assistant.", description="Optional system prompt"
    )
    max_tokens: int | None = Field(
        default=None, ge=1, le=8192, description="Override max tokens for response"
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
    text = getattr(result, "text", None)

    return GeminiPromptResponse(text=text or "")
