const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// Database connection (separate database for template store)
const sequelize = new Sequelize('ecd_template_store', 'ecd_user', 'ecd_password', {
  host: 'postgres',
  dialect: 'postgresql',
  logging: false
});

// Template Store Model
const StoreTemplate = sequelize.define('StoreTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  subcategory: DataTypes.STRING,
  difficulty: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
  ageGroupMin: DataTypes.INTEGER,
  ageGroupMax: DataTypes.INTEGER,
  culturalTags: DataTypes.ARRAY(DataTypes.STRING),
  languages: DataTypes.ARRAY(DataTypes.STRING),
  content: DataTypes.JSONB,
  thumbnail: DataTypes.TEXT,
  authorName: DataTypes.STRING,
  authorEmail: DataTypes.STRING,
  version: DataTypes.STRING,
  downloads: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  fileSize: DataTypes.INTEGER
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Initialize database
sequelize.sync({ force: false });

// Get all published templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await StoreTemplate.findAll({
      where: { isPublished: true },
      order: [['downloads', 'DESC']]
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish template
app.post('/api/templates/publish', async (req, res) => {
  try {
    const template = await StoreTemplate.create({
      ...req.body,
      isPublished: true,
      version: '1.0.0'
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download template as .ecdx file
app.get('/api/templates/:id/download', async (req, res) => {
  try {
    const template = await StoreTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Increment download count
    await template.increment('downloads');

    // Create .ecdx file (ZIP with template data)
    const archive = archiver('zip');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${template.name}.ecdx"`);
    
    archive.pipe(res);
    archive.append(JSON.stringify(template, null, 2), { name: 'template.json' });
    archive.finalize();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Template Studio Server running on port ${PORT}`);
});