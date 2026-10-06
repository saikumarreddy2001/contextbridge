from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_catch_up_endpoint():
    response = client.get(
        "/api/projects/project-atlas/catch-up",
        params={"user_id": "alex-morgan", "start_date": "2026-09-16", "end_date": "2026-09-23"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["eventsAnalyzed"] >= 40
    assert body["catchUpItems"][0]["kind"] == "decision"
    assert body["catchUpItems"][0]["contextFocusId"] == "authentication-decision-revised"
    assert body["actionItems"]
    assert body["unresolvedDiscussions"]
    titles = [item["title"].lower() for item in body["catchUpItems"]]
    assert any("auth" in title or "revised" in title for title in titles)
    assert not any("sticker" in title or "playlist" in title for title in titles)


def test_graph_timeline_and_search():
    graph = client.get("/api/projects/atlas/graph")
    assert graph.status_code == 200
    nodes = {node["id"]: node for node in graph.json()["nodes"]}
    assert nodes["auth0-selected"]["status"] == "Superseded"
    assert nodes["custom-authentication-architecture"]["status"] == "Current"
    edges = graph.json()["edges"]
    assert any(edge["relationshipType"] == "superseded_by" for edge in edges)
    assert any(edge["source"] == "pr-184" and edge["target"] == "token-refresh-limitation" for edge in edges)

    timeline = client.get("/api/projects/project-atlas/timeline", params={"start_date": "2026-09-16", "end_date": "2026-09-23"})
    assert timeline.status_code == 200
    lanes = {lane["id"] for lane in timeline.json()["lanes"]}
    assert lanes == {"authentication", "payment", "api-contract"}
    events = timeline.json()["events"]
    assert any(event["id"] == "auth0-selected" and event["evolution"] == "superseded" for event in events)

    search = client.get("/api/projects/project-atlas/search", params={"q": "authentication", "type": "decision"})
    assert search.status_code == 200
    results = search.json()["results"]
    assert results
    assert all(result["type"] == "decision" for result in results)
    assert any("authentication" in result["title"].lower() or "authentication" in result["snippet"].lower() for result in results)


def test_context_node_endpoint():
    response = client.get("/api/context/authentication-decision-revised")
    assert response.status_code == 200
    body = response.json()
    assert body["node"]["id"] == "authentication-decision-revised"
    assert body["incoming"]
    assert body["evidence"]
