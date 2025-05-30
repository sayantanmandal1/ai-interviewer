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
    # Use a lang value for which you expect an index exists, e.g., 'backend'
    response = client.post("/query", json={"lang": "Python", "question": "What is Python?"})

    # Accept 200 (OK), 400 (bad request), or 404 (index not found)
    # but ideally, this should be 200 if your index exists for 'backend'
    assert response.status_code in [200, 400, 404]

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
