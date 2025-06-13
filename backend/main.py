from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, DomainRequest, AnswerSubmission
from qa_engine import QAGenerator
from llama_index_helper import load_index
import openai, os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
qa = QAGenerator()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query_index(data: QueryRequest):
    index = load_index(data.lang)
    query_engine = index.as_query_engine()
    try:
        result = query_engine.query(data.question)
        return {"answer": result.response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Query failed: {e}")

@app.post("/start")
async def start_interview(request: DomainRequest):
    output = qa.generate_questions(request.domain, request.level)
    return {"questions": output["questions"], "session_id": output["session_id"]}


@app.post("/evaluate")
async def evaluate_answers(request: AnswerSubmission):
    print("Received session_id:", request.session_id)
    print("Received answers:", request.answers)

    try:
        result = qa.evaluate_answers(request.session_id, request.answers)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Evaluation failed: {e}")
    

@app.get("/final_result")
async def final_result(easy_id: str, medium_id: str = None, hard_id: str = None):
    try:
        easy_score = SESSIONS[easy_id]["score"]
        medium_score = SESSIONS[medium_id]["score"] if medium_id else 0
        hard_score = SESSIONS[hard_id]["score"] if hard_id else 0

        passed = (
            (easy_score >= 80) or 
            (medium_score >= 60) or 
            (hard_score >= 40)
        )

        return {
            "passed": passed,
            "easy_score": easy_score,
            "medium_score": medium_score,
            "hard_score": hard_score,
            "final_result": "Passed" if passed else "Failed"
        }

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Session ID missing or invalid: {e}")

