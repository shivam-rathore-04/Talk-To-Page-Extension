import os
import re
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

class SecurityProxy:
    def __init__(self):
        # 2. Get the token from .env
        token = os.getenv("HUGGINGFACE_TOKEN")
        
        if not token:
            print("SECURITY ERROR: HUGGINGFACE_TOKEN not found in .env")
        # We use Llama-Guard-3-8B for high-accuracy safety checks
        # You can also use "meta-llama/Llama-Guard-3-1B" for even faster speeds
        self.client = InferenceClient(
            model="meta-llama/Llama-Guard-3-8B",
            token=token
        )  
        
    def sanitize_xml(self, text: str) -> str:
        """Prevents users from 'escaping' our fence."""
        return text.replace("<", "&lt;").replace(">", "&gt;")
        
    def llamaguard_check(self, text: str) -> bool:
        """
        Policy Enforcement Point (PEP): 
        Consults Llama Guard using the conversational API.
        """
        try:
            # Llama models now require a "chat message" format
            messages = [{"role": "user", "content": text}]
            
            # Use chat_completion instead of text_generation
            response = self.client.chat_completion(
                messages=messages, 
                max_tokens=10 # max_tokens instead of max_new_tokens for chat
            )
            
            # Extract the actual text from the chat response
            output = response.choices[0].message.content.strip().lower()
            
            if "unsafe" in output:
                return False
            return True
        except Exception as e:
            print(f"Security layer fallback: {e}")
            return True # Fallback to allow if API is down    

    def wrap_input(self, user_input: str) -> str:
        """The Proxy logic: Inspect, Sanitize, and Fence."""
        # 1. PEP Check (The AI Security Guard)
        if not self.llamaguard_check(user_input):
            raise ValueError("Unsafe content or prompt injection detected.")
        
        # 2. XML Sanitization (The Fencing)
        safe_input = self.sanitize_xml(user_input)
        
        return f"<user_input>\n{safe_input}\n</user_input>"

security_layer = SecurityProxy()