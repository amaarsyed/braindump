from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests
from dotenv import load_dotenv
<<<<<<< HEAD
import secrets
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Environment variables configuration
class Config:
    API_KEY = os.environ.get("API_KEY")
    OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
    PORT = int(os.environ.get("PORT", 8000))
    HOST = os.environ.get("HOST", "0.0.0.0")
    MODEL = "nousresearch/deephermes-3-mistral-24b-preview:free"

app = FastAPI()

# Configure CORS (for dev, you can use ["*"] to allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all
=======

# Load environment variables from .env file (private, not exposed to frontend)
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
>>>>>>> 5df0a70bb99ecd3955394d58a59e1f60a89293a4
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Validate environment variables
def validate_env_vars():
    missing_vars = []
    if not Config.API_KEY:
        missing_vars.append("process.env.API_KEY")
    if not Config.OPENROUTER_API_KEY:
        missing_vars.append("process.env.OPENROUTER_API_KEY")
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Validate on startup
validate_env_vars()
=======
# Get API keys from environment variables (private, not VITE_*)
API_KEY = os.getenv("API_KEY") or "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"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or "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"
>>>>>>> 5df0a70bb99ecd3955394d58a59e1f60a89293a4

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

def generate_response(messages: List[Message]) -> str:
<<<<<<< HEAD
    conversation = [{"role": "system", "content": "You are brainly, an AI assistant for a whiteboard application. Act like JARVIS from Iron Man, providing helpful, witty, and concise responses."}]
    conversation.extend([{"role": msg.role, "content": msg.content} for msg in messages])
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Whiteboard JARVIS",
            },
            json={
                "model": Config.MODEL,
                "messages": conversation,
            },
            timeout=30  # Add timeout for robustness
        )
        print("OpenRouter API status:", response.status_code)
        print("OpenRouter API response:", response.text)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"OpenRouter API error: {response.text}")
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        print("RequestException:", str(e))
        raise HTTPException(status_code=500, detail=f"Error calling OpenRouter API: {str(e)}")
    except Exception as e:
        print("General Exception:", str(e))
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, api_key: str = Header(None, alias="api-key")):
    if not api_key or not secrets.compare_digest(api_key, Config.API_KEY):
        print("Invalid API key received:", api_key)
=======
    # Format the conversation history for OpenRouter
    conversation = [{"role": "system", "content": "You are JARVIS, an AI assistant for a whiteboard application. Act like JARVIS from Iron Man, providing helpful, witty, and concise responses."}]
    conversation.extend([{"role": msg.role, "content": msg.content} for msg in messages])
    
    try:
        # Call OpenRouter API
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-3.5-turbo",  # or any other model you prefer
                "messages": conversation,
            },
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"OpenRouter API error: {response.text}")
        
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenRouter API: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, api_key: str = Header(None, alias="api-key")):
    if api_key != API_KEY:
>>>>>>> 5df0a70bb99ecd3955394d58a59e1f60a89293a4
        raise HTTPException(status_code=401, detail="Invalid API key")
    try:
        response = generate_response(request.messages)
        return ChatResponse(response=response)
    except Exception as e:
<<<<<<< HEAD
        print("Error in /api/chat:", str(e))
=======
>>>>>>> 5df0a70bb99ecd3955394d58a59e1f60a89293a4
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
<<<<<<< HEAD
    uvicorn.run(app, host=Config.HOST, port=Config.PORT) 
=======
    uvicorn.run(app, host="0.0.0.0", port=8000) 
>>>>>>> 5df0a70bb99ecd3955394d58a59e1f60a89293a4
