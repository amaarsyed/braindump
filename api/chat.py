import os
import requests
import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
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
            
            # Get API key from environment
            api_key = os.environ.get("OPENROUTER_API_KEY")
            if not api_key:
                self.send_error_response(500, "OpenRouter API key not set")
                return
            
            # Call OpenRouter API
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
                self.send_error_response(response.status_code, f"OpenRouter API error: {response.text}")
                return
            
            result = response.json()
            answer = result["choices"][0]["message"]["content"]
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = json.dumps({"answer": answer})
            self.wfile.write(response_data.encode('utf-8'))
            
        except requests.exceptions.Timeout:
            self.send_error_response(504, "Request timeout")
        except Exception as e:
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_data = json.dumps({"error": message})
        self.wfile.write(error_data.encode('utf-8')) 