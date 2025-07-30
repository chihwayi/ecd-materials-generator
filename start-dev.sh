#!/bin/bash

echo "🚀 Starting ECD Materials Generator Development Environment..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    pkill -f "docker-compose"
    pkill -f "nodemon"
    pkill -f "react-scripts"
    exit 0
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Start Docker services (PostgreSQL & Redis)
echo "📊 Starting database services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Start backend server
echo "🔧 Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../client
NODE_OPTIONS="--openssl-legacy-provider" npm start &
FRONTEND_PID=$!

echo "✅ All services started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📊 Database: postgresql://ecd_user:ecd_password@localhost:5432/ecd_db"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait