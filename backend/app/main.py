from fastapi import FastAPI

from app.api.gemini_routes import router as gemini_router
from app.api.tts_routes import router as tts_router

app = FastAPI()

app.include_router(gemini_router)
app.include_router(tts_router)


@app.get("/")
def root():
    return {"message": "Hello, world!"}
