# ECD Learning Materials Generator

A comprehensive platform for creating culturally-appropriate early childhood development learning materials for Zimbabwean children.

## 🚀 Quick Start

### One-Command Startup
```bash
npm run dev
```

This will automatically start:
- PostgreSQL & Redis (Docker)
- Backend API server (port 5000)
- Frontend React app (port 3000)

### Manual Setup (First Time)
```bash
npm run setup  # Install all dependencies
npm run dev    # Start all services
```

### Stop All Services
```bash
npm run stop
```

## 🔗 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Database**: postgresql://ecd_user:ecd_password@localhost:5432/ecd_db

## 🔐 Test Login

- **Email**: teacher@test.com
- **Password**: password123

## 📁 Project Structure

```
ecd-materials-generator/
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared utilities
├── assets/          # Static assets
├── start-dev.sh     # Development startup script
└── package.json     # Root package.json
```

## 🛠️ Development

- All services start automatically with `npm run dev`
- Frontend hot-reloads on changes
- Backend restarts automatically with nodemon
- Database persists data between restarts

## 🎯 Features

- ✅ Authentication & Authorization
- ✅ Template-based Material Creation
- ✅ Multi-language Support (EN/SN/ND)
- ✅ Cultural Content Integration
- ✅ Assignment Management
- ✅ Progress Tracking
- ✅ Offline-first Design


## Read The SRS.md and Project Structure.md to have an indepth of the system and its components
