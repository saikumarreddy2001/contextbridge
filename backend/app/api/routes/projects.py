from fastapi import APIRouter, HTTPException, Query

from app.repositories.event_repository import canonical_project_id
from app.services.reconstruction.pipeline import catch_up_response, graph_response, search_response, timeline_response

router = APIRouter()


def _known(project_id: str) -> str:
    canonical = canonical_project_id(project_id)
    if canonical != "project-atlas":
        raise HTTPException(status_code=404, detail="Unknown project")
    return canonical


@router.get("/projects/{project_id}/catch-up")
def catch_up(
    project_id: str,
    user_id: str = Query(default="alex-morgan"),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
) -> dict:
    _known(project_id)
    return catch_up_response(project_id, user_id, start_date, end_date)


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
    return graph_response(project_id)


@router.get("/projects/{project_id}/search")
def search(
    project_id: str,
    q: str = Query(default=""),
    type: str | None = Query(default=None),
    person: str | None = Query(default=None),
    status: str | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
) -> dict:
    _known(project_id)
    return search_response(project_id, q, type, person, status, start_date, end_date)
