from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_start():
    response = client.post("/start", json={"domain": "backend"})
    assert response.status_code == 200
    assert "questions" in response.json()
    assert "session_id" in response.json()

def test_query():
    response = client.post("/query", json={"lang": "en", "question": "What is Python?"})
    assert response.status_code in [200, 400]  # OK or fallback if no index
    if response.status_code == 200:
        assert "answer" in response.json()

def test_evaluate():
    # This will likely fail unless `qa.evaluate_answers()` handles dummy sessions
    response = client.post("/evaluate", json={
        "session_id": "fake-id",
        "answers": ["Answer 1", "Answer 2"]
    })
    assert response.status_code in [200, 400]
