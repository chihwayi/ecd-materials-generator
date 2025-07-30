const express = require('express');
const { getTemplates, getTemplate, getCategories } = require('../controllers/templates.controller');

const router = express.Router();

router.get('/', getTemplates);
router.get('/categories', getCategories);
router.get('/:id', getTemplate);

module.exports = router;