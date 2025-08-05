#!/bin/bash

echo "🚀 Setting up ECD Learning Materials Generator..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd server && npm install && cd ..
cd client && npm install --legacy-peer-deps && cd ..

# Start database
echo "🗄️ Starting database..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
cd server && npm run migrate && cd ..

# Run seeds
echo "🌱 Running database seeds..."
cd server && npm run seed && cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""
echo "🔐 Test accounts:"
echo "   Teacher: teacher@test.com / password123"
echo "   School Admin: bbanda@gmail.com / brian123"
echo "   Finance: finance@school.com / finance123"
echo ""
echo "🚀 Start the application with: npm run dev" 