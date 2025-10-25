from fastapi import FastAPI

from app.api.gemini_routes import router as gemini_router

app = FastAPI()

app.include_router(gemini_router)


@app.get("/")
def root():
    return {"message": "Hello, world!"}
