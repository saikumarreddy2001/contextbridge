from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.context import router as context_router
from app.api.routes.projects import router as projects_router

app = FastAPI(title="ContextBridge reconstruction", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:43123", "http://localhost:43123"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
app.include_router(projects_router, prefix="/api")
app.include_router(context_router, prefix="/api")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
