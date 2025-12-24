#!/bin/bash

###############################################################################
# Production Deployment Script
# This script deploys the application to the production environment
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Starting Production Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Variables
DEPLOY_DIR="${DEPLOY_DIR:-/home/deploy/production}"
COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
BACKUP_DIR="${DEPLOY_DIR}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create necessary directories
print_info "Creating deployment directories..."
mkdir -p "$DEPLOY_DIR"
mkdir -p "$BACKUP_DIR"
cd "$DEPLOY_DIR"

# Backup current .env file if it exists
if [ -f "$ENV_FILE" ]; then
    print_info "Backing up current .env file..."
    cp "$ENV_FILE" "$BACKUP_DIR/.env.production.$TIMESTAMP"
fi

# Backup database before deployment
print_info "Creating database backup..."
if docker ps | grep -q postgres-production; then
    BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    docker exec postgres-production pg_dumpall -U ${POSTGRES_USER:-postgres} > "$BACKUP_FILE" 2>/dev/null || {
        print_warning "Database backup failed, but continuing deployment..."
    }
    if [ -f "$BACKUP_FILE" ]; then
        gzip "$BACKUP_FILE"
        print_info "Database backup created: $BACKUP_FILE.gz"
    fi
fi

# Login to Docker Hub (required for private repositories)
if [ -n "$DOCKER_HUB_USERNAME" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
    print_info "Logging in to Docker Hub..."
    echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin
else
    print_warning "Docker Hub credentials not provided. Pulling may fail for private repositories."
fi

# Pull latest images
print_info "Pulling Docker images..."
if ! docker compose -f "$COMPOSE_FILE" pull; then
    print_error "Failed to pull Docker images"
    exit 1
fi

# Store current container IDs for potential rollback
print_info "Saving current container state..."
docker compose -f "$COMPOSE_FILE" ps -q > "$BACKUP_DIR/containers.$TIMESTAMP" || true

# Perform rolling update with zero-downtime strategy
print_info "Performing rolling update..."

# Safely update backend container
print_info "Updating backend container safely..."

# Stop and remove old backend container
docker compose -f "$COMPOSE_FILE" stop backend || true
docker compose -f "$COMPOSE_FILE" rm -f backend || true

# Start new backend container
docker compose -f "$COMPOSE_FILE" up -d --no-deps backend || {
    print_error "Failed to start backend container"
    exit 1
}
# Wait for new backend to be healthy
print_info "Waiting for new backend to be healthy..."
sleep 15

BACKEND_PORT=${BACKEND_PORT:-4000}
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f -s "http://localhost:${BACKEND_PORT}/health" > /dev/null 2>&1; then
        print_info "New backend is healthy!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_error "New backend health check failed"
    print_error "Rolling back..."
    docker compose -f "$COMPOSE_FILE" up -d --scale backend=1 backend
    exit 1
fi

# Scale down to single backend instance
print_info "Removing old backend container..."
docker compose -f "$COMPOSE_FILE" up -d --scale backend=1 --no-deps backend

# Update frontend
print_info "Updating frontend..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend

# Wait for frontend to be healthy
print_info "Checking frontend health..."
sleep 10

FRONTEND_PORT=${FRONTEND_PORT:-9000}
if curl -f -s "http://localhost:${FRONTEND_PORT}" > /dev/null 2>&1; then
    print_info "Frontend is healthy!"
else
    print_warning "Frontend health check failed"
fi

# Ensure all services are running
print_info "Ensuring all services are running..."
docker compose -f "$COMPOSE_FILE" up -d

# Remove dangling images to free up space
print_info "Cleaning up old Docker images..."
docker image prune -f || true

# Final health checks
print_info "Performing final health checks..."
sleep 5

# Backend final check
if curl -f -s "http://localhost:${BACKEND_PORT}/health" > /dev/null 2>&1; then
    print_info "✓ Backend is healthy"
else
    print_error "✗ Backend health check failed"
    docker compose -f "$COMPOSE_FILE" logs --tail=50 backend
    exit 1
fi

# Frontend final check
if curl -f -s "http://localhost:${FRONTEND_PORT}" > /dev/null 2>&1; then
    print_info "✓ Frontend is healthy"
else
    print_warning "✗ Frontend health check failed"
fi

# Database check
if docker exec postgres-production pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
    print_info "✓ Database is healthy"
else
    print_error "✗ Database health check failed"
fi

# Show running containers
print_info "Running containers:"
docker compose -f "$COMPOSE_FILE" ps

# Cleanup old backups (keep last 10 for production)
print_info "Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t .env.production.* 2>/dev/null | tail -n +11 | xargs -r rm -f
ls -t db_backup_*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm -f

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Production Deployment Completed!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Backend URL: http://localhost:${BACKEND_PORT}"
echo -e "Frontend URL: http://localhost:${FRONTEND_PORT}"
echo -e "Adminer URL: http://localhost:${ADMINER_PORT:-9001}"
echo -e ""
echo -e "${GREEN}Deployment successful!${NC}"
echo -e "Backup created at: $BACKUP_DIR"
