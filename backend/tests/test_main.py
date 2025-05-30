from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_start():
    response = client.post("/start", json={"domain": "backend"})
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    assert "session_id" in data

def test_query():
    response = client.post("/query", json={"lang": "en", "question": "What is Python?"})
    if response.status_code not in [200, 400]:
        print("test_query failed:", response.status_code, response.text)
    assert response.status_code in [200, 400]

    if response.status_code == 200:
        data = response.json()
        assert "answer" in data

def test_evaluate():
    payload = {
        "session_id": "fake-id",
        "answers": [
            {"id": 1, "type": "descriptive", "user_answer": "Answer 1"},
            {"id": 2, "type": "mcq", "user_answer": "Answer 2"}
        ]
    }
    response = client.post("/evaluate", json=payload)
    if response.status_code not in [200, 400]:
        print("test_evaluate failed:", response.status_code, response.text)
    assert response.status_code in [200, 400]
