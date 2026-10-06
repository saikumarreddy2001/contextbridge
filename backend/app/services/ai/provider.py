import os
from typing import Protocol

from app.services.ai.log import log_ai
from app.services.ai.models import AIAnswer, AIChangeExplanation, AIRelationshipCandidate, AIStorySummary, RetrievedContext
import time


class AIProvider(Protocol):
    name: str

    def generate_summary(self, context: RetrievedContext) -> AIStorySummary: ...

    def answer_question(self, context: RetrievedContext, question: str, history: list[dict[str, str]]) -> AIAnswer: ...

    def extract_relationships(self, context: RetrievedContext) -> list[AIRelationshipCandidate]: ...

    def generate_explanation(self, context: RetrievedContext) -> AIChangeExplanation: ...

    def create_embedding(self, text: str) -> list[float]: ...


def get_provider() -> AIProvider | None:
    """Return the configured provider. `none` returns None so methods are not called."""
    name = os.environ.get("AI_PROVIDER", "none").strip().lower() or "none"
    if name == "none":
        return None
    if name == "mock":
        from app.services.ai.mock import MockProvider

        return MockProvider()
    if name == "openai":
        key = os.environ.get("AI_API_KEY", "").strip()
        if not key:
            started = time.perf_counter()
            log_ai("provider", "openai", started, success=False, fallback=True)
            return None
        from app.services.ai.openai_provider import OpenAIProvider

        model = os.environ.get("AI_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"
        return OpenAIProvider(api_key=key, model=model)
    started = time.perf_counter()
    log_ai("provider", name, started, success=False, fallback=True)
    return None
