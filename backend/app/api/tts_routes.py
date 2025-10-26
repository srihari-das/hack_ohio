from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
import os
import httpx
import logging

from app.config import settings


router = APIRouter()
logger = logging.getLogger(__name__)


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1)
    voice_id: str | None = None  # optional override
    model_id: str | None = None  # optional model override
    stability: float | None = None
    similarity_boost: float | None = None


@router.post("/tts", response_class=Response)
async def synthesize_tts(body: TTSRequest):
    api_key = settings.ELEVENLABS_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY not set")

    voice_id = (
        body.voice_id or settings.ELEVENLABS_VOICE_ID or "21m00Tcm4TlvDq8ikWAM"
    )  # Rachel default
    model_id = body.model_id or "eleven_multilingual_v2"

    url_tpl = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
    }
    payload = {
        "text": body.text,
        "model_id": model_id,
        "voice_settings": {
            "stability": body.stability if body.stability is not None else 0.5,
            "similarity_boost": (
                body.similarity_boost if body.similarity_boost is not None else 0.75
            ),
        },
        # Optional latency optimization (does not change output format)
        "optimize_streaming_latency": 2,
    }

    async def attempt(vid: str):
        url = url_tpl.format(voice_id=vid)
        async with httpx.AsyncClient(timeout=40) as client:
            return await client.post(url, headers=headers, json=payload)

    # First attempt with configured voice
    try:
        r = await attempt(voice_id)
    except Exception as e:
        logger.exception("ElevenLabs request failed for voice %s", voice_id)
        raise HTTPException(status_code=502, detail=f"TTS request failed: {e}")

    if r.status_code >= 400:
        # Log provider error body for diagnostics
        body_text = r.text
        logger.warning(
            "ElevenLabs error %s for voice %s: %s", r.status_code, voice_id, body_text
        )
        # Retry once with default voice if likely a voice issue
        default_voice = "21m00Tcm4TlvDq8ikWAM"
        if voice_id != default_voice and r.status_code in (400, 404):
            try:
                r2 = await attempt(default_voice)
                if r2.status_code < 400:
                    return Response(content=r2.content, media_type="audio/mpeg")
                else:
                    logger.warning(
                        "ElevenLabs fallback also failed: %s %s",
                        r2.status_code,
                        r2.text,
                    )
            except Exception as e:
                logger.exception("Fallback ElevenLabs request failed: %s", e)

        # Return provider error to client
        try:
            err = r.json()
        except Exception:
            err = body_text
        raise HTTPException(
            status_code=r.status_code, detail={"provider": "elevenlabs", "error": err}
        )

    return Response(content=r.content, media_type="audio/mpeg")
