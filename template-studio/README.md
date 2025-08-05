# 🎨 ECD Template Studio & Marketplace

## Overview
A complete template creation and distribution ecosystem for the ECD Materials Generator platform.

## Architecture

### 1. **Template Studio** (Port 3001)
- Visual drag-and-drop template creator
- Rich canvas with shapes, text, interactive elements
- Export templates as `.ecdx` files
- Publish to marketplace

### 2. **Template Marketplace** (Port 5001)
- Centralized template repository
- Browse, search, and download templates
- Version control and ratings
- API for template distribution

### 3. **ECD Platform Integration**
- Browse marketplace modal
- One-click template installation
- Upload `.ecdx` files directly
- Seamless template management

## Setup Instructions

### 1. Install Dependencies
```bash
cd template-studio
npm run setup
```

### 2. Create Template Store Database
```bash
# Connect to PostgreSQL and create database
sudo -u postgres psql
CREATE DATABASE ecd_template_store;
GRANT ALL PRIVILEGES ON DATABASE ecd_template_store TO ecd_user;
\q
```

### 3. Start Template Studio
```bash
npm run dev
```

### 4. Access Applications
- **Template Studio**: http://localhost:3001
- **Marketplace API**: http://localhost:5001
- **Main ECD Platform**: http://localhost:3000

## Features

### Template Studio
- ✅ Drag-and-drop canvas (Fabric.js)
- ✅ Shape library (circles, rectangles, triangles)
- ✅ Interactive elements (drop zones, draggable items)
- ✅ Text tools
- ✅ Template metadata editor
- ✅ Export to `.ecdx` format
- ✅ Publish to marketplace

### Marketplace Integration
- ✅ Browse templates modal in main platform
- ✅ Search and filter functionality
- ✅ One-click installation
- ✅ Upload `.ecdx` files
- ✅ Download tracking
- ✅ Template versioning

### File Format: `.ecdx`
Custom extension for ECD templates:
- ZIP archive containing `template.json`
- Includes all template data, metadata, and assets
- Portable between ECD platform instances

## Usage Workflow

1. **Create Template**: Use Template Studio to design interactive templates
2. **Publish**: Export and publish to marketplace
3. **Distribute**: Share `.ecdx` files or use marketplace
4. **Install**: Import templates into any ECD platform instance
5. **Use**: Create assignments with installed templates

## Database Schema

### StoreTemplate Table
- `id`: UUID primary key
- `name`: Template name
- `description`: Template description
- `category`: Template category
- `content`: Template data (JSONB)
- `thumbnail`: Base64 thumbnail
- `downloads`: Download count
- `rating`: Average rating
- `isPublished`: Publication status

## API Endpoints

### Marketplace API (Port 5001)
- `GET /api/templates` - List published templates
- `POST /api/templates/publish` - Publish new template
- `GET /api/templates/:id/download` - Download template as .ecdx

### ECD Platform API (Port 5000)
- `GET /api/v1/marketplace/browse` - Browse marketplace
- `POST /api/v1/marketplace/install/:id` - Install template
- `POST /api/v1/marketplace/upload` - Upload .ecdx file