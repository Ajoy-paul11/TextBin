# TextBin

A minimal, secure, and temporary text storage service — optimized for quick sharing and safe production deployment. Built with Next.js, Node.js, and PostgreSQL (via Prisma).

## Features

- **Create Pastes:** Share code or text snippets instantly.
- **Expiration (TTL):** Set pastes to auto-expire after a specific time (e.g., 1 minute, 1 hour).
- **View Limits:** Restrict the number of times a paste can be viewed.
- **Syntax Highlighting:** Automatic detection and highlighting for major programming languages.
- **Dark Mode:** Sleek, modern dark-themed UI.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon DB), Prisma ORM

## Local Development

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Docker & Docker Compose (for local Postgres)

### 1. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` (see `.env.example`):

```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/pastebin?schema=public"
TEST_MODE=0
FRONTEND_URL=http://localhost:3000
```

Add a `docker-compose.yml` at repo `root` to run Postgres and Adminer for quick DB inspection:

Run migrations:

```bash
# If you maintain migrations
npx prisma migrate dev --name init
# or to push schema without migrations in local/dev
npx prisma db push
```

Generate the Prisma client and build the backend:

```bash
npx prisma generate
npm run build
```

Start the backend development:

```bash
# development (fast edit/reload)
npx ts-node-dev --respawn --transpile-only src/index.ts
# or production-similar run (after build)
node dist/index.js
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env.local` file in `Frontend/` (see `.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the app:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## API Documentation

### 1. Health Check

- **Endpoint:** `GET /api/healthz`
- **Response:** `200 OK`
  ```json
  { "ok": true }
  ```

### 2. Create Paste

- **Endpoint:** `POST /api/pastes`
- **Body:**
  ```json
  {
    "content": "string (required)",
    "ttl_seconds": "number (optional, >= 1)",
    "max_views": "number (optional, >= 1)"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "id": "string",
    "url": "http://.../p/<id>"
  }
  ```

### 3. Get Paste (JSON)

- **Endpoint:** `GET /api/pastes/:id`
- **Response:** `200 OK`
  ```json
  {
    "content": "string",
    "remaining_views": "number | null",
    "expires_at": "ISO string | null"
  }
  ```
- **Errors:** `404 Not Found` (if expired, view limit exceeded, or invalid ID).

### 4. View Paste (HTML)

- **Endpoint:** `GET /p/:id`
- **Response:** `200 OK` (HTML content) or `404 Not Found`.

## Persistence Layer

We use **PostgreSQL** as the persistence layer, managed by Prisma ORM. This ensures data survives application restarts and provides robust transactional guarantees for view counting and expiry enforcement.

## Design Decisions

- **Atomic Database Operations:** We use a safe update pattern (atomic increment) to prevent race conditions on view counting.
- **Server vs Client Rendering:** The (`/p/:id`) HTML view is implemented server-side so the app can return proper HTTP status codes (404) when needed.
- **Security:** `helmet` and `express-rate-limit` are used to reduce common web risks and abuse.
- **Testing hooks:** The backend supports `x-test-now-ms` when `TEST_MODE` is enabled to simulate TTL expirations for testing.
