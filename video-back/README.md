# FastAPI Project with PostgreSQL

This is a FastAPI project with PostgreSQL database integration, using Docker for containerization.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the application:
```bash
docker-compose up --build
```

The application will be available at http://localhost:8000

API documentation will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
.
├── app/
│   ├── main.py          # FastAPI application
│   └── database.py      # Database configuration
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── pyproject.toml       # Project dependencies
└── README.md           # This file
```

## Development

The project uses Poetry for dependency management. The Docker setup includes:
- Python 3.12
- FastAPI
- PostgreSQL 16
- SQLAlchemy for database operations
- Alembic for database migrations

## Environment Variables

The following environment variables can be configured:
- `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@db:5432/fastapi_db)

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint

## License

MIT 