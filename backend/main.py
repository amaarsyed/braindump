from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key for authentication
API_KEY = "your-secret-api-key"  # Replace with your actual API key

# OpenRouter API Key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "your-openrouter-api-key")  # Replace with your actual OpenRouter API key

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

def generate_response(messages: List[Message]) -> str:
    # Format the conversation history for OpenRouter
    conversation = [{"role": msg.role, "content": msg.content} for msg in messages]
    
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
        raise HTTPException(status_code=500, detail="Failed to get response from OpenRouter")
    
    return response.json()["choices"][0]["message"]["content"]

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, api_key: str = Header(None)):
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