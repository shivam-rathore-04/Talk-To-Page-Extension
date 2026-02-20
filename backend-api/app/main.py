from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.logic import get_answer_from_page

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    context: str
    session_id: str  # <--- NEW

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Pass session_id to logic
        answer = get_answer_from_page(request.question, request.context, request.session_id)
        return {"answer": answer}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)