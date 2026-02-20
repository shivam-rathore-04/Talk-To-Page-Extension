# Backend API Setup

## Prerequisites

**Python Version:** Python 3.8+ (Python 3.13 supported)
- Uses `faiss-cpu>=1.13.1` which supports Python 3.13

## Quick Setup

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

## Manual Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate virtual environment:
   - Windows: `venv\Scripts\activate.bat`
   - Linux/Mac: `source venv/bin/activate`

3. Install uv:
   ```bash
   pip install uv
   ```

4. Install requirements using uv:
   ```bash
   uv pip install -r requirements.txt
   ```

5. Create `.env` file with your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

6. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

