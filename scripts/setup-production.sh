#!/bin/bash

echo "🚀 Setting up ECD Materials Generator - Production Environment"

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET environment variable is required"
    exit 1
fi

# Build Docker images
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Setup database
echo "🗄️ Setting up database..."
docker-compose run --rm backend npm run migrate

# Start services
echo "🚀 Starting production services..."
docker-compose up -d

# Health check
echo "🏥 Running health checks..."
sleep 30

# Check if services are healthy
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is running and healthy"
else
    echo "❌ Application health check failed"
    docker-compose logs
    exit 1
fi

echo "✅ Production deployment complete!"
echo ""
echo "📊 Services available at:"
echo "   - Application: http://localhost"
echo "   - API Health: http://localhost/health"

