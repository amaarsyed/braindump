import os
import requests
import json
import secrets
from http.server import BaseHTTPRequestHandler
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.environ.get("API_KEY", "default-key")  # Default for development

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Make API key verification optional for development
            header_key = self.headers.get('api-key')
            if API_KEY and API_KEY != "default-key":
                if not header_key or not secrets.compare_digest(header_key, API_KEY):
                    self.send_error_response(401, 'Invalid API key')
                    return

            # Get content length and read body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON
            try:
                data = json.loads(post_data.decode('utf-8'))
                prompt = data.get("prompt", "")
            except json.JSONDecodeError:
                self.send_error_response(400, "Invalid JSON")
                return
            
            if not prompt:
                self.send_error_response(400, "No prompt provided")
                return
            
            # Get API key from environment (loaded from .env file)
            api_key = os.environ.get("OPENROUTER_API_KEY")
            if not api_key:
                # Return a mock response if no API key is configured
                mock_response = f"Hello! You said: '{prompt}'. This is a mock response since no OpenRouter API key is configured."
                self.send_success_response({"answer": mock_response})
                return
            
            # Call OpenRouter API with simpler free model
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://braindump-six.vercel.app",
                    "X-Title": "Braindump Chat"
                },
                json={
                    "model": "mistralai/mistral-7b-instruct:free",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.7
                },
                timeout=30
            )
            
            if response.status_code != 200:
                error_text = response.text[:200]  # Limit error message length
                self.send_error_response(response.status_code, f"API error: {error_text}")
                return
            
            result = response.json()
            
            # Check if the response has the expected structure
            if 'choices' not in result or len(result['choices']) == 0:
                self.send_error_response(500, "Invalid API response format")
                return
                
            answer = result["choices"][0]["message"]["content"]
            self.send_success_response({"answer": answer})
            
        except requests.exceptions.Timeout:
            self.send_error_response(504, "Request timeout - API took too long to respond")
        except requests.exceptions.RequestException as e:
            self.send_error_response(500, f"Network error: {str(e)}")
        except Exception as e:
            print(f"Error in chat API: {str(e)}")  # Server-side logging
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, api-key')
        self.end_headers()
    
    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = json.dumps(data)
        self.wfile.write(response_data.encode('utf-8'))
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, api-key')
        self.end_headers()
        
        error_data = json.dumps({"error": message})
        self.wfile.write(error_data.encode('utf-8')) 
