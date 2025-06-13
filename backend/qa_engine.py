import re
import json
import uuid
import os
from dotenv import load_dotenv
from openai import OpenAI
from fastapi import HTTPException
from utils import get_embedding
from sklearn.metrics.pairwise import cosine_similarity
from models import AnswerItem
from typing import List

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
SESSIONS = {}

class QAGenerator:
    def __init__(self):
        pass

    def convert_options_to_dict(self,options):
        if isinstance(options, list):
            keys = ["a", "b", "c", "d"]
            return {k: v for k, v in zip(keys, options)}
        return options  # Already a dict or not applicable


    def generate_questions(self, domain: str, level: str) -> dict:
        prompt = f"""
            Generate 10 {level} level interview questions (mix of MCQs + Descriptive) on {domain}.
            Format: JSON list of objects with keys: id, question, type, correct_answer, options.
            For MCQs, 'options' must be a list of 4 values.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful interviewer assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500,
            )

            content = response.choices[0].message.content
            print("OpenAI raw response:", content)

            # Try to extract JSON block
            json_pattern = r"```json\s*(\[[\s\S]*?\])\s*```"
            match = re.search(json_pattern, content)
            if match:
                json_str = match.group(1)
            else:
                # Fallback if no triple backticks
                start = content.find('[')
                end = content.rfind(']') + 1
                json_str = content[start:end]

            questions = json.loads(json_str)

            if not isinstance(questions, list) or len(questions) == 0:
                raise ValueError("No questions generated")

            for q in questions:
                q['type'] = q.get('type', '').lower()
                q['id'] = q.get('id', str(uuid.uuid4()))

                if q['type'] == 'mcq':
                    q['options'] = self.convert_options_to_dict(q.get('options', []))


        except Exception as e:
            print("OpenAI error or parsing failed:", e)
            questions = self._generate_fallback_questions(domain)

        session_id = str(uuid.uuid4())
        SESSIONS[session_id] = {
            "questions": questions,
            "domain": domain,
            "level": level,
            "score": None,
            "result": None
        }

        return {"session_id": session_id, "questions": questions}

    def _generate_fallback_questions(self, domain):
        # Provide dummy fallback questions to avoid empty UI
        return [{
            "id": i,
            "question": f"Dummy question {i+1} about {domain}",
            "type": "mcq",
            "correct_answer": "Option A",
            "options": ["Option A", "Option B", "Option C", "Option D"]
        } for i in range(10)]

    def evaluate_answers(self, session_id: str, answers: List[AnswerItem]) -> dict:
        print("Current sessions:", SESSIONS.keys())

        if session_id not in SESSIONS:
            raise HTTPException(status_code=400, detail="Invalid session ID")

        questions = SESSIONS[session_id]["questions"]
        total = 0

        for ans in answers:
            question = next((q for q in questions if str(q['id']) == str(ans.id)), None)
            if not question:
                continue

            if question['type'].lower() == 'mcq':
                if ans.user_answer.strip().lower() == question['correct_answer'].strip().lower():
                    total += 10
            elif question['type'].lower() == 'descriptive':
                emb_correct = get_embedding(question['correct_answer'])
                emb_user = get_embedding(ans.user_answer)
                sim = cosine_similarity([emb_correct], [emb_user])[0][0]
                score = sim * 10
                total += min(score, 10)
            else:
                continue

        score = round(total, 2)
        result = "Passed" if score >= 50 else "Failed"

        SESSIONS[session_id]["score"] = score
        SESSIONS[session_id]["result"] = result

        return {"score": score, "result": result}

