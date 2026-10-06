from fastapi import APIRouter, HTTPException

from app.services.reconstruction.pipeline import context_response

router = APIRouter()


@router.get("/context/{node_id}")
def context(node_id: str) -> dict:
    payload = context_response(node_id)
    if payload is None:
        raise HTTPException(status_code=404, detail="Unknown context node")
    return payload
