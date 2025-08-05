#!/bin/bash

echo "🚀 Starting ECD Materials Generator in Development Mode with Hot Reloading..."

# Kill any processes using our ports
echo "🔄 Cleaning up ports..."
for port in 3000 5000 5432 6379; do
  PID=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo "   Killing process on port $port (PID: $PID)"
    kill -9 $PID 2>/dev/null
  fi
done

# Stop any existing docker services
echo "🛑 Stopping existing services..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null

# Check if containers need to be built (first time or after changes)
if [ ! "$(docker images -q ecd-materials-generator_frontend-dev 2> /dev/null)" ] || [ ! "$(docker images -q ecd-materials-generator_backend-dev 2> /dev/null)" ]; then
    echo "🔨 Building containers for the first time..."
    docker-compose -f docker-compose.dev.yml build
fi

# Start development services (without rebuilding)
echo "🚀 Starting development services with hot reloading..."
docker-compose -f docker-compose.dev.yml up -d

echo "✅ Development services starting..."
echo "📊 Main ECD Platform: http://localhost:3000 (with hot reloading)"
echo "🏪 Backend API: http://localhost:5000"
echo "🗄️  Database: localhost:5432"

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🎉 Development environment is ready!"
echo "💡 Your code changes will automatically reload in the browser!"
echo "📝 To view logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "🔧 To rebuild containers: docker-compose -f docker-compose.dev.yml build" 