const { Material, User } = require('../models');
const { logger } = require('../utils/logger');

const getMaterials = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, subject, language, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { creatorId: req.user.id };
    if (type) where.type = type;
    if (subject) where.subject = subject;
    if (language) where.language = language;
    if (status) where.status = status;

    const materials = await Material.findAndCountAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      limit: parseInt(limit),
      offset,
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      data: materials.rows,
      pagination: {
        total: materials.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(materials.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get materials error:', error);
    res.status(500).json({ message: 'Failed to fetch materials' });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { title, description, type, subject, language, ageGroup, status, elements } = req.body;

    console.log('Creating material with data:', {
      title,
      description,
      type: type || 'worksheet',
      subject: subject || 'math',
      language: language || 'en',
      ageGroup: ageGroup || '3-5',
      status: status || 'draft',
      elements: elements || [],
      creatorId: req.user.id
    });

    const material = await Material.create({
      title,
      description,
      type: type || 'worksheet',
      subject: subject || 'math',
      language: language || 'en',
      ageGroup: ageGroup || '3-5',
      status: status || 'draft',
      elements: elements || [],
      creatorId: req.user.id,
      publishedAt: status === 'published' ? new Date() : null
    });

    const materialWithCreator = await Material.findByPk(material.id, {
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }]
    });

    res.status(201).json(materialWithCreator);
  } catch (error) {
    console.error('Create material error:', error);
    logger.error('Create material error:', error);
    res.status(500).json({ message: 'Failed to create material', error: error.message });
  }
};

const getMaterial = async (req, res) => {
  try {
    const material = await Material.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.user.id
      },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }]
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await material.increment('views');

    res.json(material);
  } catch (error) {
    logger.error('Get material error:', error);
    res.status(500).json({ message: 'Failed to fetch material' });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { title, description, type, subject, language, ageGroup, status, elements } = req.body;

    const material = await Material.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.user.id
      }
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (subject !== undefined) updateData.subject = subject;
    if (language !== undefined) updateData.language = language;
    if (ageGroup !== undefined) updateData.ageGroup = ageGroup;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && !material.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (elements !== undefined) updateData.elements = elements;

    await material.update(updateData);

    const updatedMaterial = await Material.findByPk(material.id, {
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }]
    });

    res.json(updatedMaterial);
  } catch (error) {
    logger.error('Update material error:', error);
    res.status(500).json({ message: 'Failed to update material' });
  }
};

const publishMaterial = async (req, res) => {
  try {
    const material = await Material.findOne({
      where: { 
        id: req.params.id,
        creatorId: req.user.id
      }
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await material.update({
      status: 'published',
      publishedAt: new Date()
    });

    res.json({ message: 'Material published successfully', material });
  } catch (error) {
    logger.error('Publish material error:', error);
    res.status(500).json({ message: 'Failed to publish material' });
  }
};

module.exports = { getMaterials, createMaterial, getMaterial, updateMaterial, publishMaterial };