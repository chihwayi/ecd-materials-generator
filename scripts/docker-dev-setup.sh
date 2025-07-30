#!/bin/bash

# Docker Development Setup Script
# This script helps you get started with the optimized development environment

echo "🐳 ECD Materials Generator - Development Setup"
echo "=============================================="

# Stop any running containers
echo "📦 Stopping any running containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Clean up Docker system (optional)
read -p "🧹 Do you want to clean up Docker system? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning up Docker system..."
    docker system prune -f
    docker volume prune -f
fi

# Build and start development environment
echo "🚀 Building and starting development environment..."
echo "This may take 5-10 minutes on first run..."

# Use BuildKit for better caching
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with no cache on first run for clean start
docker-compose -f docker-compose.dev.yml build --no-cache

# Start the services
echo "🎯 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

# Show status
echo "📊 Container status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Development environment is starting up!"
echo ""
echo "🌐 Services will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo "   Redis:    localhost:6379"
echo "   MailHog:  http://localhost:8025"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop:         docker-compose -f docker-compose.dev.yml down"
echo "   Restart:      docker-compose -f docker-compose.dev.yml restart"
echo "   Shell access: docker-compose -f docker-compose.dev.yml exec backend sh"
echo ""
echo "🎉 Happy coding!"