# Image Locker Application (Docker: Frontend + Backend + MySQL)

This project runs a full stack setup locally using Docker Compose:

- Frontend: React + Vite
- Backend: Spring Boot (Java 17) + JWT Authentication
- Database: MySQL 8 with initialization SQL

---

## Prerequisites

Install:

- Docker Desktop (must be running)
- Git (optional)

Verify Docker:

```bash
docker --version
docker compose version
```

---

## Project Structure

```
image-locker-application/
  docker-compose.yml
  mysql/
    init/
      01_schema.sql
  image-locker-service/
    Dockerfile
    src/...
  image-locker-frontend/
    Dockerfile
    vite.config.js
    src/...
```

---

## Services and Ports

| Service  | URL |
|----------|-----|
Frontend | http://localhost:4173 |
Backend  | http://localhost:8080 |
MySQL    | localhost:3307 |

> If port 3306 is free on your machine, MySQL may be 3306 instead of 3307.

---

## Run the Application

From project root:

```bash
cd ~/Desktop/image-locker-application
docker compose up --build
```

Open:

Frontend → http://localhost:4173  
Backend → http://localhost:8080  

---

## Run in Background

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker ps
```

---

## View Logs

All services:

```bash
docker compose logs -f
```

Backend only:

```bash
docker logs -f image-locker-backend
```

MySQL only:

```bash
docker logs -f image-locker-mysql
```

---

## Stop Application

```bash
docker compose down
```

---

## Reset Everything (Delete DB + Reinitialize)

⚠️ Deletes MySQL data

```bash
docker compose down -v
docker compose up --build
```

Full reset including images:

```bash
docker compose down -v --rmi all
docker compose up --build
```

---

## MySQL Initialization

Init SQL location:

```
mysql/init/01_schema.sql
```

Runs automatically on first container start.

---

## Access MySQL (CLI)

```bash
docker exec -it image-locker-mysql mysql -uappuser -papppass image_locker
```

Useful SQL:

```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE images;
SELECT * FROM users;
SELECT * FROM images;
```

---

## Connect MySQL Using Workbench / DBeaver

Host: 127.0.0.1  
Port: 3307  
Database: image_locker  
User: appuser  
Password: apppass  

---

## Common Issues

### Docker not running

Error: Cannot connect to Docker daemon  
Fix: Start Docker Desktop

---

### Port 3306 already in use

Edit docker-compose.yml:

```yaml
ports:
  - "3307:3306"
```

Then:

```bash
docker compose down
docker compose up --build
```

---

### Auth endpoints blocked (403)

Security config must:

- disable CSRF
- permit `/api/auth/**`
- attach JWT filter

---

## Quick Commands Reference

```bash
# Start
docker compose up --build

# Start background
docker compose up --build -d

# Logs
docker compose logs -f

# Stop
docker compose down

# Reset DB
docker compose down -v
docker compose up --build
```
