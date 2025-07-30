const express = require('express');
const { body } = require('express-validator');
const { getMaterials, createMaterial, getMaterial, updateMaterial } = require('../controllers/materials.controller');
const { validationMiddleware } = require('../middleware/validation.middleware');

const router = express.Router();

const createMaterialValidation = [
  body('title').trim().isLength({ min: 1 }),
  body('templateId').isUUID(),
  body('content').isObject()
];

router.get('/', getMaterials);
router.post('/', createMaterialValidation, validationMiddleware, createMaterial);
router.get('/:id', getMaterial);
router.put('/:id', updateMaterial);

module.exports = router;