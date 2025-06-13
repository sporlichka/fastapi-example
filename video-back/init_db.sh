#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h db -p 5432 -U postgres; do
    sleep 1
done

echo "PostgreSQL is ready!"

# Add current directory to PYTHONPATH
export PYTHONPATH=$PYTHONPATH:/app

# Ensure alembic directory exists
mkdir -p alembic/versions

# Apply migrations
echo "Applying migrations..."
alembic upgrade head

# Verify database connection and tables
echo "Verifying database connection..."
export PGPASSWORD=postgres
psql -h db -U postgres -d fastapi_db -c "\dt"

echo "Database initialization completed!" 