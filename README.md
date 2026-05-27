# BlablaBook – Frontend

BlablaBook est une application web permettant aux utilisateurs de gérer leur bibliothèque personnelle et de découvrir des nouveaux livres.
L’objectif est de créer un espace simple et intuitif pour suivre ses lectures, rechercher des ouvrages et consulter leurs informations.
Cette application inclut également une dimension communautaire, permettant aux utilisateurs de partager leurs lectures et recommandations avec leurs amis.

---

## Lancer le projet en local

Pour le frontend :

```bash
cd front
pnpm install
pnpm dev
```

## Running the Project with Docker

To launch the development environment using Docker, follow these steps:

1. Copy the `.env.docker.dev.example` file and rename it to `.env.docker.dev`.
2. Update the `.env.docker.dev` file with the appropriate environment variables.
3. Copy the `/back/.env.example` file and rename it to `.env`.
4. Update the `/back/.env` file with the appropriate environment variables.
5. Start the Docker containers with the following command:

   ```bash
   docker compose --env-file .env.docker.dev up
   ```

This will start the following services:

- PostgreSQL database
- Adminer for database management
- Express backend server
- Generate Prisma client and push the state from Prisma schema to the database
- Vite frontend server

To stop the containers, run the following `docker` command:

```bash
docker compose --env-file .env.docker.dev down
```

If changes occur in the files and it is necessary to rebuild the docker-compose, run the following command:

```bash
   docker compose --env-file .env.docker.dev up --build
```

Command to clean the docker cache if needed:

```bash
   docker system prune

   # Valid command with 'y' and press enter
```

## Database Seeding with dataset

To start with a clean database, follow these steps:

- Delete the folder containing the Prisma client: `generated/`
- Delete the Prisma migrations by removing the `migrations/` folder located in the `prisma/` directory
- Clear the Docker cache with the command `docker system prune -f`.
- Delete all Docker volumes (be careful, this deletes all unused volumes, check that the volumes you want to delete do not contain important data). To do this, run the command:

  ```bash
  docker volume prune -f
  ```

- Delete the Blablabook database volume: `docker volume rm blabla-book_blablabook-db-volume`
- Start the docker-compose: `docker compose --env-file .env.docker.dev up`
- In the backend service container, reset the migrations with the command: `pnpm prisma:migrate:reset`
- In the backend service container, run the development migration with the command: `pnpm prisma:migrate:dev`.  
  Prisma will ask you to give a name to the migration. Enter a name (for example `init-db`) and press enter.
- To seed the database with a dataset for the library, in the backend service container run the command: `pnpm prisma:seed`
- To clear the database and reset the library dataset to its initial state, run the following command in the backend service container: `pnpm prisma:reset`

Users created in the database for development after seeding:

```json
[
  {
    "username": "Yoko",
    "email": "yoko@mail.com",
    "password": "Password12345!",
  },
  {
    "username": "John",
    "email": "john@mail.com",
    "password": "Password12345!",
  },
  {
    "username": "Paul",
    "email": "paul@mail.com",
    "password": "Password12345!",
  },
  {
    "username": "Ringo",
    "email": "ringo@mail.com",
    "password": "Password12345!",
  },
  {
    "username": "Georges",
    "email": "georges@mail.com",
    "password": "Password12345!",
  },
];
```
