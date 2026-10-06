# monday clone

Fullstack starter for a Monday.com-style work board app.

**Stack:** React + TypeScript + Axios + Tailwind (Vite) · Django REST + SimpleJWT · PostgreSQL · Docker Compose

## Features (MVP)

- JWT register / login
- Per-user workspaces and boards
- Groups, items, status + text columns
- Board UI with sidebar navigation

## Quick start (Docker Compose)

Requires Docker and Docker Compose. Host port **5433** is used for Postgres so it does not clash with a local Postgres on 5432.

```bash
cp .env.dev.example .env.dev
docker compose up --build
```

If you previously ran another Compose stack in this folder and the DB fails to authenticate, reset the volume once:

```bash
docker compose down -v
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:8000/api  
- Admin: http://localhost:8000/admin  

1. Open the app and **register** a user  
2. Create a **workspace**, then a **board** (seeded with Status/Text columns and a group)  
3. Add items, set status, edit text cells  

## Local development (without full Compose)

You can run frontend and backend on the host, and still use Compose only for Postgres if you want:

```bash
# Terminal 1 — database only
docker compose up db

# Terminal 2 — backend
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export $(grep -v '^#' ../.env.dev | xargs)
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5433
python manage.py migrate
python manage.py runserver

# Terminal 3 — frontend
cd frontend
npm install
npm run dev
```

Leave `VITE_API_URL` empty so Vite proxies `/api` to `http://localhost:8000`.

To use a host Postgres instead of Compose `db`, set `POSTGRES_HOST` / `POSTGRES_PORT` accordingly and create a database matching `POSTGRES_DB`.

## API overview

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register/` | Returns user + JWT tokens |
| POST | `/api/auth/token/` | Login |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/POST | `/api/workspaces/` | List / create (owner = current user) |
| GET/PATCH/DELETE | `/api/workspaces/:id/` | Workspace detail |
| GET/POST | `/api/workspaces/:id/boards/` | Nested boards (create seeds defaults) |
| GET/PATCH/DELETE | `/api/boards/:id/` | Full board payload (columns, groups, items, cells) |
| POST | `/api/boards/:id/groups/` | Add group |
| PATCH/DELETE | `/api/groups/:id/` | Update / delete group |
| POST | `/api/groups/:id/items/` | Add item |
| PATCH/DELETE | `/api/items/:id/` | Update / delete item |
| PATCH | `/api/items/:id/cells/:column_id/` | Upsert cell `{ "value": { ... } }` |

All board routes require `Authorization: Bearer <access>`.

### Cell value shapes

- **status:** `{ "label": "Done", "color": "#00c875" }`
- **text:** `{ "text": "notes here" }`

## Project layout

```
backend/          Django project (config, accounts, boards)
frontend/         Vite React TypeScript app
docker-compose.yml
.env.dev.example
```

## Out of scope (next TODOs)

- Drag-and-drop reorder
- Real-time updates (WebSockets)
- Comments, files, people columns
- Automations / notifications
- Multi-member workspaces and roles

## License

MIT (or your choice)
