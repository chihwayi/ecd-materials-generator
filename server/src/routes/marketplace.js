const express = require('express');
const multer = require('multer');
const { Template } = require('../models');
const { authenticateToken } = require('../middleware/auth.middleware');
const axios = require('axios');
const AdmZip = require('adm-zip');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get marketplace templates
router.get('/browse', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/api/templates');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace templates' });
  }
});

// Install template from marketplace
router.post('/install/:templateId', authenticateToken, async (req, res) => {
  try {
    // Download template from marketplace
    const response = await axios.get(`http://localhost:5001/api/templates/${req.params.templateId}/download`, {
      responseType: 'arraybuffer'
    });
    
    // Extract .ecdx file
    const zip = new AdmZip(response.data);
    const templateData = JSON.parse(zip.readAsText('template.json'));
    
    // Install to local database
    const installedTemplate = await Template.create({
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      subcategory: templateData.subcategory || 'imported',
      difficulty: templateData.difficulty,
      ageGroupMin: templateData.ageGroupMin,
      ageGroupMax: templateData.ageGroupMax,
      culturalTags: templateData.culturalTags,
      languages: templateData.languages,
      content: templateData.content,
      thumbnail: templateData.thumbnail,
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      isPremium: false,
      isActive: true
    });

    res.json({ 
      message: 'Template installed successfully',
      template: installedTemplate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to install template' });
  }
});

// Upload .ecdx file
router.post('/upload', authenticateToken, upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract .ecdx file
    const zip = new AdmZip(req.file.buffer);
    const templateData = JSON.parse(zip.readAsText('template.json'));
    
    // Install to local database
    const installedTemplate = await Template.create({
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      subcategory: templateData.subcategory || 'imported',
      difficulty: templateData.difficulty,
      ageGroupMin: templateData.ageGroupMin,
      ageGroupMax: templateData.ageGroupMax,
      culturalTags: templateData.culturalTags,
      languages: templateData.languages,
      content: templateData.content,
      thumbnail: templateData.thumbnail,
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      isPremium: false,
      isActive: true
    });

    res.json({ 
      message: 'Template uploaded successfully',
      template: installedTemplate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload template' });
  }
});

module.exports = router;