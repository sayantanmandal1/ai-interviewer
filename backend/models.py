from pydantic import BaseModel
from typing import List, Optional, Union



class DomainRequest(BaseModel):
    domain: str
    level: str = "easy"

class QueryRequest(BaseModel):
    lang: str
    question: str

class GeneratedQuestion(BaseModel):
    id: int
    question: str
    type: str  # "mcq" or "descriptive"
    correct_answer: str
    options: Optional[List[str]] = []

class AnswerItem(BaseModel):
    id: Union[int, str]
    type: str
    user_answer: str

class AnswerSubmission(BaseModel):
    session_id: str
    answers: List[AnswerItem]