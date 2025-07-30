const { Template, User } = require('../models');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');
const sequelize = require('../config/database.config');

const getTemplates = async (req, res) => {
  try {
    const { category, difficulty, language, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isActive: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (language) where.languages = { [Op.contains]: [language] };

    const templates = await Template.findAndCountAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      limit: parseInt(limit),
      offset,
      order: [['downloads', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      templates: templates.rows,
      pagination: {
        total: templates.count,
        page: parseInt(page),
        pages: Math.ceil(templates.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

const getTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }]
    });

    if (!template || !template.isActive) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    logger.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Template.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { isActive: true },
      group: ['category'],
      raw: true
    });

    res.json({ categories });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = { getTemplates, getTemplate, getCategories };