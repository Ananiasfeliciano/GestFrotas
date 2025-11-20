#!/bin/sh
# usage: ./run_migrations.sh
# Assumes DATABASE_URL is set (e.g. in docker-compose env_file)
echo "Running prisma generate..."
npx prisma generate

echo "Running prisma migrate dev..."
npx prisma migrate deploy

echo "If you want to run dev migrations use: npx prisma migrate dev --name init"
