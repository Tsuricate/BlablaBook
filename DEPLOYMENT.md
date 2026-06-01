# 📦 BlablaBook – Deployment Guide

> Production deployment guide for BlablaBook.

BlablaBook is deployed using:

- **Frontend** → Render (Nginx + Vite build)
- **Backend** → Render (Docker)
- **Database** → Neon (PostgreSQL cloud)
- **Domain** → OVH DNS

---

## 🧱 Architecture Overview

BlablaBook uses a separated architecture:

- Frontend is built with Vite and served through **Nginx**
- Backend is a **Node.js API running in a Docker container**
- Database is hosted on **Neon (PostgreSQL cloud service)**
- API requests are proxied at the frontend level using Nginx (`/api` → backend service)

---

### Backend environment (production)

The backend uses a dedicated production environment file: `.env.docker.prod`
It includes:

- NODE_ENV=production
- DATABASE_URL (Neon PostgreSQL)
- JWT_SECRET
- JWT_EXPIRES_IN

These variables are required for the backend to run in production.
The backend is containerized using Docker.

The production image is automatically built and deployed by Render using the repository Dockerfile.

### Backend deployment

Backend deployment is containerized via Docker and managed by Render.

- Installs pnpm and dependencies
- Generates the Prisma client
- Starts the Node.js server

### Frontend deployment

The frontend is built and served using a Docker multi-stage build:

- Vite builds the React application
- Nginx serves the static files

---

### 🗄️ Database (Neon)

BlablaBook uses Neon as a managed PostgreSQL database.

#### Connection string format

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### Prisma in Production

To apply database migrations in production:

```bash
prisma migrate deploy
```

### Frontend / Backend communication

The frontend and backend are served under the same domain using a reverse proxy (Nginx in production).

This setup helps avoids cross-origin issues such as third-party cookie restrictions and simplifies authentication.

### Domain Configuration (OVH)

The domain is configured via OVH DNS and points to Render.
Render supports multiple DNS configurations depending on provider:

- `CNAME` for subdomains (`www`)
- `A record` for root domain (`@`) pointing to Render IP

#### Current configuration:

| Type  | Name | Value                         |
| ----- | ---- | ----------------------------- |
| CNAME | www  | blablabook-front.onrender.com |
| A     | @    | 216.24.57.1                   |

### 🔄 Deployment flow

1. Code is pushed to the `main` branch
2. Render automatically deploys backend (Docker-based service)
3. The frontend is deployed on Render using a Docker multi-stage build (Vite + Nginx).
4. Neon provides managed PostgreSQL database access via `DATABASE_URL`
5. OVH DNS points the domain to the Render frontend service
6. Backend is accessed via `/api` through Nginx reverse proxy configuration

JWT_SECRET and DATABASE_URL must be configured in Render environment variables or via .env.docker.prod
