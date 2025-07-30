const { Material, Template, User } = require('../models');
const { logger } = require('../utils/logger');

const getMaterials = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const materials = await Material.findAndCountAll({
      where: { creatorId: req.user.id },
      include: [
        { model: Template, attributes: ['name', 'category'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      materials: materials.rows,
      pagination: {
        total: materials.count,
        page: parseInt(page),
        pages: Math.ceil(materials.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { title, description, templateId, content, tags } = req.body;

    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const material = await Material.create({
      title,
      description,
      templateId,
      creatorId: req.user.id,
      content,
      tags: tags || []
    });

    res.status(201).json({
      message: 'Material created successfully',
      material
    });
  } catch (error) {
    logger.error('Create material error:', error);
    res.status(500).json({ error: 'Failed to create material' });
  }
};

const getMaterial = async (req, res) => {
  try {
    const material = await Material.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.user.id
      },
      include: [
        { model: Template, attributes: ['name', 'category'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ]
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await material.increment('views');
    await material.update({ lastAccessed: new Date() });

    res.json({ material });
  } catch (error) {
    logger.error('Get material error:', error);
    res.status(500).json({ error: 'Failed to fetch material' });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { title, description, content, tags } = req.body;

    const material = await Material.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.user.id
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await material.update({
      title: title || material.title,
      description: description || material.description,
      content: content || material.content,
      tags: tags || material.tags
    });

    res.json({
      message: 'Material updated successfully',
      material
    });
  } catch (error) {
    logger.error('Update material error:', error);
    res.status(500).json({ error: 'Failed to update material' });
  }
};

module.exports = { getMaterials, createMaterial, getMaterial, updateMaterial };