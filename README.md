# ContextBridge

ContextBridge reconstructs scattered workplace context for Northstar Technologies. The shell and Overview are in place. `/catch-up` walks the September 16–23 Atlas story.

Alex Morgan, Senior Product Engineer, was away for 8 working days. Overview shows what changed on Project Atlas: the Auth0 decision, the September 22 revision, and the payment sandbox blocker. There is no backend.

## Run locally

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0:43123`. Open [http://127.0.0.1:43123](http://127.0.0.1:43123). `/` redirects to `/overview`.

```bash
npm run build
```

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
| `/settings` | Settings, including theme |
| `/help` | Help |
