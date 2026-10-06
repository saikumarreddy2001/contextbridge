from fastapi import Request
from fastapi.testclient import TestClient

from app.main import app, cors_origins, unhandled_error
from app.services.ai.limits import reset_limits
from app.services.ai.mock import MockProvider
from app.services.ai.provider import get_provider


def test_health_does_not_call_ai(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "none")
    MockProvider.calls = 0
    client = TestClient(app)
    assert client.get("/health").json() == {"status": "healthy", "service": "contextbridge-api"}
    assert client.get("/api/health").json() == {"status": "ok"}
    assert MockProvider.calls == 0


def test_none_still_serves_catch_up(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "none")
    client = TestClient(app)
    catch_up = client.get(
        "/api/projects/project-atlas/catch-up",
        params={"user_id": "alex-morgan", "start_date": "2026-09-16", "end_date": "2026-09-23"},
    )
    assert catch_up.status_code == 200
    assert catch_up.json()["catchUpItems"][0]["kind"] == "decision"


def test_capabilities(monkeypatch):
    client = TestClient(app)
    monkeypatch.setenv("AI_PROVIDER", "none")
    monkeypatch.delenv("AI_API_KEY", raising=False)
    assert client.get("/api/capabilities").json() == {
        "ai": False,
        "semanticSearch": True,
        "contextReconstruction": True,
    }
    monkeypatch.setenv("AI_PROVIDER", "mock")
    assert client.get("/api/capabilities").json()["ai"] is True
    monkeypatch.setenv("AI_PROVIDER", "gemini")
    assert client.get("/api/capabilities").json()["ai"] is False
    monkeypatch.setenv("AI_PROVIDER", "openai")
    assert client.get("/api/capabilities").json()["ai"] is False
    monkeypatch.setenv("AI_API_KEY", "present")
    assert client.get("/api/capabilities").json()["ai"] is True


def test_cors_production_drops_wildcard(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ALLOWED_ORIGINS", "https://atlas.web.app, *")
    assert cors_origins() == ["https://atlas.web.app"]
    monkeypatch.delenv("ENVIRONMENT", raising=False)
    monkeypatch.setenv("ALLOWED_ORIGINS", "")
    assert cors_origins() == ["http://127.0.0.1:43123", "http://localhost:43123"]


def test_ai_rate_limit(monkeypatch):
    from app.services.ai import limits

    monkeypatch.setattr(limits, "LIMIT", 2)
    reset_limits()
    client = TestClient(app)
    body = {"question": "Why did authentication change?", "history": []}
    assert client.post("/api/projects/project-atlas/ask", json=body).status_code == 200
    assert client.post("/api/projects/project-atlas/ask", json=body).status_code == 200
    blocked = client.post("/api/projects/project-atlas/ask", json=body)
    assert blocked.status_code == 429
    assert blocked.json()["detail"] == "Too many AI requests. Try again shortly."
    assert blocked.headers["retry-after"] == "60"
    reset_limits()


def test_long_question_is_not_echoed():
    reset_limits()
    client = TestClient(app)
    question = "q" * 501
    response = client.post("/api/projects/project-atlas/ask", json={"question": question, "history": []})
    assert response.status_code == 400
    assert response.json()["detail"] == "That question is too long."
    assert question not in response.text
    reset_limits()


def test_validation_error_hides_the_body():
    client = TestClient(app)
    response = client.post("/api/projects/project-atlas/ask", json={"history": []})
    assert response.status_code == 422
    assert response.json() == {"detail": "The request was not valid."}


def test_gemini_missing_key_falls_back_and_default_model_is_not_called(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "gemini")
    monkeypatch.delenv("AI_API_KEY", raising=False)
    assert get_provider() is None
    monkeypatch.setenv("AI_API_KEY", "test-key-not-sent")
    monkeypatch.setenv("AI_MODEL", "")
    provider = get_provider()
    assert provider is not None
    assert provider.name == "gemini"
    assert provider.model == "gemini-3.8-flash"


def test_unhandled_error_hides_secrets_and_paths():
    scope = {
        "type": "http",
        "http_version": "1.1",
        "method": "GET",
        "scheme": "http",
        "path": "/boom",
        "raw_path": b"/boom",
        "query_string": b"",
        "headers": [],
        "client": ("127.0.0.1", 123),
        "server": ("test", 80),
    }
    response = unhandled_error(Request(scope), RuntimeError("sk-live /home/ubuntu/secret AIzaSecret"))
    text = bytes(response.body).decode()
    assert response.status_code == 500
    assert "The request could not be completed." in text
    assert "Traceback" not in text
    assert "sk-live" not in text
    assert "AIza" not in text
    assert "/home" not in text
