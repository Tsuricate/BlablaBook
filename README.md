# 📚 BlablaBook

![Node](https://img.shields.io/badge/node-18-green)
![React](https://img.shields.io/badge/react-frontend-blue)
![PostgreSQL](https://img.shields.io/badge/postgres-db-blue)

> A full-stack web application for managing personal book collections and discovering new reads.

---

## 📖 Overview

BlablaBook is a web application that allows users to manage their personal library, track reading progress, and discover new books through search and thematic recommendations.

It provides a simple and intuitive interface to organize books, monitor reading activity, and explore new literary content.

## ✨ Features

#### 🔐 Authentication

- Create an account and log in to access a personalized space
- Guest mode available to browse the application without authentication (home, search, and discovery)

#### 🔎 Book search & discovery

- Search books by title, author, or keywords
- Access detailed pages for each book with complete information

#### 📚 Personal library

- Add books to a personal collection
- Organize books by reading status (to read, reading, completed)
- Remove books from the library at any time

#### 🎨 User experience

- Light / dark mode
- Multilingual support (French / English)

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Chakra UI

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Prisma ORM

### Infrastructure

- Docker (development environment)

## 🏗️ Architecture

BlablaBook is a full-stack application composed of:

- A **React frontend** built with Vite
- A **Node.js/Express backend API**
- A **PostgreSQL database managed with Prisma**

The frontend communicates with the backend through REST API calls.
The project is fully containerized using Docker to ensure a consistent development environment.

## 📁 Project structure

```text
blabla-book/
├── front/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── locales/
│       ├── mocks/
│       ├── schema/
│       ├── theme/
│       ├── types/
│       └── utils/
│
├── back/
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routers/
│       ├── schema/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── tests/
│
├── docker-compose.yml
├── README.md
├── INSTALL.md
└── DEPLOYMENT.md
```

## 🐳 Development

The application can be run either with Docker or with a manual setup.

- Docker is recommended for a consistent environment across machines
- A manual setup is available for local development without containers

👉 Detailed setup instructions are available in [INSTALL.md](./INSTALL.md)

```

```
