# 📚 BlablaBook – Installation Guide

> Setup guide for running BlablaBook in a local development environment.

BlablaBook is a full-stack web application built with **React (Vite)**, **Node.js/Express**, and **PostgreSQL (Prisma ORM)**.

This guide explains how to install and run the project locally, either using Docker (recommended) or a manual setup.

---

## 🧱 Prerequisites

Before starting, make sure you have the following installed on your machine:

- **Node.js** (v18+ recommended)
- **pnpm**
- **Docker**
- **Docker Compose**

---

## 📦 1. Clone the repository

```bash
git clone <your-repository-url>
cd blabla-book
```

---

## ⚙️ 2. Environment variables

Before starting the project, create the required environment files.

### Backend

```bash
cp ./back/.env.example ./back/.env
```

Update the values inside `./back/.env` according to your local configuration.

### Frontend

```bash
cp ./front/.env.example ./front/.env
```

Update the values inside `./front/.env`.

### Docker environment variables

Docker uses a dedicated environment file located at the project root:

```bash
cp .env.docker.dev.example .env.docker.dev
```

Then update the values inside `.env.docker.dev`.

### Test environment (optional)

If you want to run tests locally:

```bash
cp ./back/.env.test.example ./back/.env.test
```

Then update values if needed.

> ⚠️ The test database should remain isolated from your development database.

## 🐳 Development with Docker

BlablaBook provides a full Docker-based development stack:

- React frontend
- Express backend
- PostgreSQL database
- Adminer database interface

### 🚀 Start the application

From the project root:

```bash
docker compose --env-file .env.docker.dev up
```

To rebuild containers if needed:

```bash
docker compose --env-file .env.docker.dev up --build
```

### 🌐 Access the services

By default:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Adminer     | http://localhost:8080 |

These ports can be customized in `.env.docker.dev`.

### ⛔ Stop the environment

```bash
docker compose --env-file .env.docker.dev down
```

## 💻 Manual installation (without Docker)

### 📦 Install dependencies

```bash
# Backend
cd back
pnpm install

# Frontend
cd ../front
pnpm install
```

### 🗄️ Database setup (Prisma)

```bash
cd back
pnpm prisma generate
pnpm prisma db push
```

If you prefer migrations (recommended for team/dev consistency):

```bash
pnpm prisma migrate dev
```

### 🚀 Start backend

```bash
cd back
pnpm dev
```

Backend runs at:
`http://localhost:3000`

### 🚀 Start frontend

```bash
cd front
pnpm dev
```

Backend runs at:
`http://localhost:5173`

## 🧪 Running tests

All tests are executed from the **backend** using Vitest and Supertest.

### 🚀 Run unit tests

```bash
pnpm test:run
```

⚠️ This command requires a **running test database**.

---

### 🧪 Run full integration tests (recommended)

This is the main command to run the full test pipeline:

```bash
pnpm test:integration
```

This command will:

- Start the test database using Docker (`docker-compose.test.yml`)
- Wait until PostgreSQL is ready
- Reset the test database (`prisma migrate reset`)
- Run all tests with Vitest
- Stop and clean the test database container
