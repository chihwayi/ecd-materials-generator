const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { checkSubscriptionStatus } = require('../middleware/subscription.middleware');
const { getMaterials, createMaterial, getMaterial, updateMaterial, publishMaterial } = require('../controllers/materials.controller');

// Get all materials for authenticated user
router.get('/', authenticateToken, checkSubscriptionStatus, getMaterials);

// Get single material by ID
router.get('/:id', authenticateToken, checkSubscriptionStatus, getMaterial);

// Create new material
router.post('/', authenticateToken, checkSubscriptionStatus, createMaterial);

// Update material
router.put('/:id', authenticateToken, checkSubscriptionStatus, updateMaterial);

// Delete material
router.delete('/:id', authenticateToken, checkSubscriptionStatus, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Mock deletion - replace with actual database delete
    console.log('Deleting material:', id, 'by user:', userId);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Failed to delete material' });
  }
});

// Publish material
router.patch('/:id/publish', authenticateToken, checkSubscriptionStatus, publishMaterial);

// Get cultural content library
router.get('/cultural/library', authenticateToken, async (req, res) => {
  try {
    const { language = 'sn', category, type } = req.query;

    // Mock cultural content - replace with actual database query
    const culturalContent = [
      {
        id: '1',
        type: 'proverb',
        title: 'Chakafukidza dzimba matenga',
        content: 'Chakafukidza dzimba matenga',
        translation: 'What covers houses is the roof',
        language: 'sn',
        category: 'wisdom',
        ageGroup: '7-12',
        audioUrl: '/audio/proverbs/chakafukidza.mp3'
      },
      {
        id: '2',
        type: 'story',
        title: 'Tsuro naSoko',
        content: 'Pane imwe nguva, kwakanga kune tsuro yakanga ichenjera kwazvo...',
        translation: 'Once upon a time, there was a very clever rabbit...',
        language: 'sn',
        category: 'folktales',
        ageGroup: '3-8',
        audioUrl: '/audio/stories/tsuro-nasoko.mp3'
      },
      {
        id: '3',
        type: 'proverb',
        title: 'Umuntu ngumuntu ngabantu',
        content: 'Umuntu ngumuntu ngabantu',
        translation: 'A person is a person through other people',
        language: 'nd',
        category: 'wisdom',
        ageGroup: '7-12'
      }
    ];

    // Apply filters
    let filteredContent = culturalContent.filter(item => item.language === language);
    if (category) filteredContent = filteredContent.filter(item => item.category === category);
    if (type) filteredContent = filteredContent.filter(item => item.type === type);

    res.json({
      data: filteredContent,
      total: filteredContent.length
    });
  } catch (error) {
    console.error('Get cultural content error:', error);
    res.status(500).json({ message: 'Failed to fetch cultural content' });
  }
});

// Get material templates
router.get('/templates/list', authenticateToken, async (req, res) => {
  try {
    const { type, subject, language } = req.query;

    // Mock templates - replace with actual database query
    const templates = [
      {
        id: 'counting',
        name: 'Counting Worksheet',
        description: 'Basic counting exercise with cultural objects',
        type: 'worksheet',
        subject: 'math',
        language: 'en',
        ageGroup: '3-5',
        thumbnail: '/images/templates/counting.png',
        elements: [
          {
            id: '1',
            type: 'text',
            content: { text: 'Count the objects:', fontSize: 18, color: '#000000' },
            position: { x: 50, y: 50 },
            size: { width: 200, height: 40 }
          },
          {
            id: '2',
            type: 'image',
            content: { src: '/images/objects/pots.png', alt: 'Traditional pots' },
            position: { x: 50, y: 120 },
            size: { width: 300, height: 200 }
          }
        ]
      },
      {
        id: 'alphabet',
        name: 'Alphabet Practice',
        description: 'Letter recognition with Shona words',
        type: 'worksheet',
        subject: 'language',
        language: 'sn',
        ageGroup: '4-6',
        thumbnail: '/images/templates/alphabet.png',
        elements: []
      },
      {
        id: 'greetings',
        name: 'Cultural Greetings',
        description: 'Traditional greetings activity',
        type: 'activity',
        subject: 'cultural',
        language: 'sn',
        ageGroup: '5-8',
        thumbnail: '/images/templates/greetings.png',
        elements: []
      }
    ];

    // Apply filters
    let filteredTemplates = templates;
    if (type) filteredTemplates = filteredTemplates.filter(t => t.type === type);
    if (subject) filteredTemplates = filteredTemplates.filter(t => t.subject === subject);
    if (language) filteredTemplates = filteredTemplates.filter(t => t.language === language);

    res.json({
      data: filteredTemplates,
      total: filteredTemplates.length
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

// Admin routes for material approval (system admin only)
router.get('/admin/pending', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    // Mock pending materials - replace with actual database query
    const pendingMaterials = [
      {
        id: '1',
        title: 'New Cultural Story',
        description: 'Traditional Ndebele story',
        type: 'story',
        subject: 'cultural',
        language: 'nd',
        status: 'pending_approval',
        author: { firstName: 'Teacher', lastName: 'Name' },
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      data: pendingMaterials,
      total: pendingMaterials.length
    });
  } catch (error) {
    console.error('Get pending materials error:', error);
    res.status(500).json({ message: 'Failed to fetch pending materials' });
  }
});

router.patch('/:id/approve', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock approval - replace with actual database update
    console.log('Approving material:', id);
    res.json({ message: 'Material approved successfully' });
  } catch (error) {
    console.error('Approve material error:', error);
    res.status(500).json({ message: 'Failed to approve material' });
  }
});

router.patch('/:id/reject', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Mock rejection - replace with actual database update
    console.log('Rejecting material:', id, 'reason:', reason);
    res.json({ message: 'Material rejected successfully' });
  } catch (error) {
    console.error('Reject material error:', error);
    res.status(500).json({ message: 'Failed to reject material' });
  }
});

module.exports = router;