from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests
from dotenv import load_dotenv
load_dotenv()
import secrets
from auth import authorize_request

# Load environment variables from .env file 
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

# Get API keys from environment variables 
API_KEY = os.getenv("API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Validate environment variables
if not API_KEY or not OPENROUTER_API_KEY:
    raise RuntimeError("Missing required environment variables: API_KEY and/or OPENROUTER_API_KEY")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

def generate_response(messages: List[Message]) -> str:
    print("Calling OpenRouter API with messages:", messages)
    print("Using OPENROUTER_API_KEY:", OPENROUTER_API_KEY)
    conversation = [{"role": "system", "content": "You are Boardly, an AI assistant for a whiteboard application. Act like whiteboard, providing helpful, witty, and concise responses."}]
    conversation.extend([{"role": msg.role, "content": msg.content} for msg in messages])
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistralai/devstral-small:free",  # or any other model you prefer
                "messages": conversation,
            },
            timeout=30
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"OpenRouter API error: {response.text}")
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenRouter API: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, authorized: None = Depends(authorize_request)):
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
