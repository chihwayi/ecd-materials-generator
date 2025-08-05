#!/bin/bash

echo "🔨 Rebuilding ECD Materials Generator containers..."

# Stop services
echo "🛑 Stopping services..."
docker-compose -f docker-compose.dev.yml down

# Remove old images
echo "🧹 Cleaning old images..."
docker-compose -f docker-compose.dev.yml down --rmi all

# Rebuild containers
echo "🔨 Building containers..."
docker-compose -f docker-compose.dev.yml build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

echo "✅ Rebuild complete!"
echo "📊 Main ECD Platform: http://localhost:3000"
echo "🏪 Backend API: http://localhost:5000" 