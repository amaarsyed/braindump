from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file (private, not exposed to frontend)
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API keys from environment variables (private, not VITE_*)
API_KEY = os.getenv("API_KEY") or "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"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or "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"

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

def generate_response(messages: List[Message]) -> str:
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
        raise HTTPException(status_code=401, detail="Invalid API key")
    try:
        response = generate_response(request.messages)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 