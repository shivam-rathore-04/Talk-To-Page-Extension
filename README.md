# 🌐 Talk-To-Page Chrome Extension

An AI-powered Chrome Extension that allows users to have conversational, context-aware chats with any webpage they are currently reading. 

Built with **React**, **FastAPI**, **LangChain**, and **Google Gemini**, this tool extracts page content, processes it through a Retrieval-Augmented Generation (RAG) pipeline, and securely answers user queries.

---

## ✨ Key Features

* **💬 Chat with Any Webpage:** Instantly summarize articles, ask specific questions, or extract key data points from the active browser tab.
* **🧠 Conversational Memory:** Remembers the context of the chat so you can ask follow-up questions naturally.
* **🛡️ Multi-Layer AI Security (PEP):** Features a custom Policy Enforcement Point (PEP) using **Meta's Llama Guard** to intercept and block malicious prompt injections before they reach the main LLM.
* **🚧 XML Fencing:** Implements strict XML tagging and sanitization to separate system instructions from untrusted user input and scraped webpage data.
* **⚡ Blazing Fast RAG:** Uses Hugging Face embeddings (`all-MiniLM-L6-v2`) and ChromaDB for rapid, in-memory semantic search of the webpage's text.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Chrome Extension)
* **Framework:** React / Vite
* **Capabilities:** Injects scripts to scrape the active DOM, manages the chat UI, and communicates with the backend API.

### Backend (FastAPI)
* **Framework:** FastAPI / Python
* **AI Framework:** LangChain (LCEL)
* **Vector Store:** ChromaDB
* **Embeddings:** HuggingFace (`all-MiniLM-L6-v2`)
* **Core LLM:** Google Gemini 2.5 Flash

### Security Layer
* **Model:** Llama-Guard-3-8B (via Hugging Face Inference API)
* **Function:** Acts as a proxy to validate user intent and prevent "Jailbreaks" or "Persona Adoption" attacks.

---

## 🚀 How to Run Locally

### 1. Backend Setup
Navigate to the backend directory and set up your virtual environment:
```bash
cd backend-api
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

Create a .env file in the backend-api folder with your API keys:

Code snippet
GOOGLE_API_KEY=your_gemini_api_key_here
HUGGINGFACE_TOKEN=your_huggingface_read_token_here
Start the FastAPI server:

```Bash
uvicorn app.main:app --reload --port 8000

### 2. Frontend Setup
Navigate to the frontend directory:

```Bash
cd frontend-extension
npm install
npm run build
3. Install the Extension in Chrome
Open Google Chrome and navigate to chrome://extensions/.

Toggle Developer mode ON in the top right corner.

Click Load unpacked and select the dist folder located inside your frontend-extension directory.

Pin the extension to your toolbar, open any webpage, and start chatting!
