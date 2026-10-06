from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field

from app.repositories.event_repository import canonical_project_id
from app.services.ai.hybrid import hybrid_search
from app.services.ai.limits import MAX_QUESTION_LENGTH, allow
from app.services.ai.service import ask, enrich_catch_up, enrich_graph, explain_change, story_summary
from app.services.reconstruction.pipeline import catch_up_response, graph_response, search_response, timeline_response

router = APIRouter()


def _known(project_id: str) -> str:
    canonical = canonical_project_id(project_id)
    if canonical != "project-atlas":
        raise HTTPException(status_code=404, detail="Unknown project")
    return canonical


def _guard(request: Request, question: str | None = None) -> None:
    if question is not None and len(question) > MAX_QUESTION_LENGTH:
        raise HTTPException(status_code=400, detail="That question is too long.")
    ip = request.client.host if request.client else "unknown"
    if not allow(ip):
        raise HTTPException(
            status_code=429,
            detail="Too many AI requests. Try again shortly.",
            headers={"Retry-After": "60"},
        )


@router.get("/projects/{project_id}/catch-up")
def catch_up(
    project_id: str,
    user_id: str = Query(default="alex-morgan"),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
) -> dict:
    _known(project_id)
    return enrich_catch_up(project_id, catch_up_response(project_id, user_id, start_date, end_date))


@router.get("/projects/{project_id}/timeline")
def timeline(
    project_id: str,
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
    event_type: str | None = Query(default=None),
    person: str | None = Query(default=None),
) -> dict:
    _known(project_id)
    return timeline_response(project_id, start_date, end_date, event_type, person)


@router.get("/projects/{project_id}/graph")
def graph(project_id: str) -> dict:
    _known(project_id)
    return enrich_graph(project_id, graph_response(project_id))


@router.get("/projects/{project_id}/search")
def search(
    project_id: str,
    q: str = Query(default=""),
    mode: str = Query(default="keyword"),
    type: str | None = Query(default=None),
    person: str | None = Query(default=None),
    status: str | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
) -> dict:
    _known(project_id)
    if mode == "hybrid":
        return hybrid_search(project_id, q, type, person, status, start_date, end_date)
    return search_response(project_id, q, type, person, status, start_date, end_date)


class AskTurn(BaseModel):
    question: str
    answer: str


class AskBody(BaseModel):
    question: str
    history: list[AskTurn] = Field(default_factory=list)


@router.post("/projects/{project_id}/explain-change/{change_id}")
def explain(project_id: str, change_id: str, request: Request) -> dict:
    _known(project_id)
    _guard(request)
    payload = explain_change(project_id, change_id)
    if payload is None:
        raise HTTPException(status_code=404, detail="Unknown change")
    return payload


@router.post("/projects/{project_id}/ask")
def ask_context(project_id: str, body: AskBody, request: Request) -> dict:
    _known(project_id)
    _guard(request, body.question)
    return ask(project_id, body.question, [turn.model_dump() for turn in body.history])


@router.get("/projects/{project_id}/stories/{story_id}/summary")
def summary(project_id: str, story_id: str, request: Request) -> dict:
    _known(project_id)
    _guard(request)
    payload = story_summary(project_id, story_id)
    if payload is None:
        raise HTTPException(status_code=404, detail="Unknown story")
    return payload
