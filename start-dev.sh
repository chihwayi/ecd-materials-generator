#!/bin/bash

echo "🚀 Starting ECD Materials Generator with Template Studio..."

# Kill any processes using our ports
echo "🔄 Cleaning up ports..."
for port in 3000 3001 5000 5001 5432 6379 8080; do
  PID=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo "   Killing process on port $port (PID: $PID)"
    kill -9 $PID 2>/dev/null
  fi
done

# Stop any existing docker services
echo "🛑 Stopping existing services..."
docker-compose down 2>/dev/null

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

echo "✅ Services starting..."
echo "📊 Main ECD Platform: http://localhost:3000"
echo "🎨 Template Studio: http://localhost:3001" 
echo "🏪 Marketplace API: http://localhost:5001"
echo "🗄️  Database: localhost:5432"

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose ps