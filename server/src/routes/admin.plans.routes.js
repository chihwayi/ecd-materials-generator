const express = require('express');
const router = express.Router();
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Get all subscription plans
router.get('/', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      order: [['price', 'ASC']]
    });
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create new subscription plan
router.post('/', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.json({ success: true, plan });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Update subscription plan
router.put('/:id', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const [updated] = await SubscriptionPlan.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const plan = await SubscriptionPlan.findByPk(req.params.id);
      res.json({ success: true, plan });
    } else {
      res.status(404).json({ error: 'Plan not found' });
    }
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete subscription plan
router.delete('/:id', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const deleted = await SubscriptionPlan.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ success: true, message: 'Plan deleted successfully' });
    } else {
      res.status(404).json({ error: 'Plan not found' });
    }
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;