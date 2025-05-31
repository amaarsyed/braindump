import os
import secrets
from fastapi import HTTPException, Header

API_KEY = os.getenv("API_KEY")

def authorize_request(api_key: str = Header(None, alias="api-key")):
    print("API_KEY from env:", API_KEY)
    print("api-key from header:", api_key)
    if not api_key or not secrets.compare_digest(api_key, API_KEY):
        raise HTTPException(status_code=401, detail="Invalid API key") 