const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { Template } = require('../models');
const router = express.Router();

// Get all templates
router.get('/', authenticateToken, async (req, res) => {
  try {
    const templates = await Template.findAll({
      where: { isActive: true },
      order: [['created_at', 'DESC']]
    });

    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get template by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findOne({
      where: { 
        id: req.params.id,
        isActive: true 
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create new template (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const template = await Template.create({
      ...req.body,
      creatorId: req.user.id
    });

    res.status(201).json({ template });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Update template (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const template = await Template.findOne({
      where: { id: req.params.id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await template.update(req.body);
    res.json({ template });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete template (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const template = await Template.findOne({
      where: { id: req.params.id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await template.destroy();
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;