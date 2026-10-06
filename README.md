# ContextBridge

ContextBridge reconstructs scattered workplace context for Northstar Technologies. The shell and Overview are in place. `/catch-up` walks the September 16–23 Atlas story.

Alex Morgan, Senior Product Engineer, was away for 8 working days. Overview shows what changed on Project Atlas: the Auth0 decision, the September 22 revision, and the payment sandbox blocker.

Catch-up, the context graph, the timeline, and search read a deterministic FastAPI reconstruction of raw Atlas events. If that service is down, each of those screens explains the failure and can switch to the saved demo data.

Ask Context, change explanations, hybrid search, and inferred graph edges are an optional AI layer on that reconstruction. The default is `AI_PROVIDER=none`, which leaves Phase 5 behavior in place. The demo uses `AI_PROVIDER=mock` (no API key and no network). See `.env.example`. Keys stay on the server.

## Run locally

Frontend:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 43123
```

The dev server binds to `0.0.0.0:43123`. Open [http://127.0.0.1:43123](http://127.0.0.1:43123). `/` redirects to `/overview`.

```bash
npm run build
```

Backend (port 8077, not 43123):

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8077
```

Tests:

```bash
cd backend
.venv/bin/pytest
```

CORS allows `http://127.0.0.1:43123` and `http://localhost:43123`. Override the API origin with `VITE_API_URL` if needed. Response shapes are documented in `backend/README.md`.

## Routes

| Path | Page |
| --- | --- |
| `/overview` | Overview dashboard |
| `/catch-up` | What you missed |
| `/timeline` | Timeline |
| `/graph` | Context Graph |
| `/decisions` | Decisions preview |
| `/sources` | Sources preview |
| `/search` | Project search |
| `/ask` | Ask Context |
| `/settings` | Settings, including theme |
| `/help` | Help |
