#!/bin/bash

echo "🚀 Setting up ECD Materials Generator - Development Environment"

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then
    echo "❌ Node.js version $REQUIRED_NODE or higher is required. Current: $NODE_VERSION"
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required but not installed"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files
echo "📝 Creating environment files..."

if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env from template"
fi

if [ ! -f client/.env ]; then
    cp client/.env.example client/.env
    echo "✅ Created client/.env from template"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup Docker development environment
echo "🐳 Setting up Docker development environment..."
docker-compose -f docker-compose.dev.yml build

# Start services
echo "🚀 Starting development services..."
docker-compose -f docker-compose.dev.yml up -d postgres redis mailhog

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
cd server && npm run migrate && npm run seed
cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🎉 You can now start development with:"
echo "   npm run dev"
echo ""
echo "📊 Available services:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - Database: postgresql://ecd_user:ecd_password@localhost:5432/ecd_db"
echo "   - Redis: redis://localhost:6379"
echo "   - MailHog (Email testing): http://localhost:8025"

