
# AI Interviewer Web Application

## Overview
This project is an AI-powered Interviewer web application designed to generate domain-specific interview questions, accept user answers, and evaluate them automatically. It supports both MCQs (auto-graded) and descriptive questions (graded using semantic similarity).

## Features
- Domain-based question generation.
- MCQ and descriptive question types.
- Semantic similarity scoring for descriptive answers using OpenAI embeddings.
- Session management to track user progress.
- REST API backend built with FastAPI.
- React frontend with an interactive interview UI.

## Backend
- FastAPI framework.
- Pydantic models for request/response validation.
- OpenAI embeddings (updated for API v1.0+).
- Session state stored in-memory (can be replaced with DB for production).
- Endpoints:
  - `/start` - Start a new interview session and generate questions.
  - `/evaluate` - Submit answers and receive evaluation scores.

## Frontend
- React-based single page application.
- Axios for HTTP requests.
- Handles question navigation, answer submission, and result display.

## How to Run

### Backend
1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate    # Linux/macOS
   .\venv\Scripts\activate  # Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY="your_api_key"  # Linux/macOS
   set OPENAI_API_KEY="your_api_key"     # Windows
   ```
4. Run the backend server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend
1. Navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

## What to Upload to GitHub
- Upload the entire project except:
  - `.env` or any file containing your API keys or secrets.
  - `venv` folder (Python virtual environment).
  - `node_modules` folder in frontend.
  - Any large index or cache files (regenerate these locally).
- Ensure `.gitignore` is properly set to exclude these.

## Contact
- Email: msayantan05@gmail.com
- GitHub: [sayantanmandal1](https://github.com/sayantanmandal1)

## License
This project is licensed under the MIT License.
