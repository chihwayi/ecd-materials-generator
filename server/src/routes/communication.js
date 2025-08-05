const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { User, Student, Message } = require('../models');
const { Op } = require('sequelize');

// Get messages for the current user
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      [Op.or]: [
        { senderId: userId },
        { recipientId: userId }
      ],
      isArchived: false
    };

    if (type !== 'all') {
      whereClause.messageType = type;
    }

    const messages = await Message.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      messages: messages.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.count,
        totalPages: Math.ceil(messages.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get unread message count
router.get('/messages/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const unreadCount = await Message.count({
      where: {
        recipientId: userId,
        isRead: false,
        isArchived: false
      }
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Send a new message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { recipientId, studentId, subject, content, messageType, priority } = req.body;
    const senderId = req.user.id;

    // Validate recipient exists
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // If studentId is provided, validate it exists
    if (studentId) {
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    const message = await Message.create({
      senderId,
      recipientId,
      studentId,
      subject,
      content,
      messageType: messageType || 'general',
      priority: priority || 'normal'
    });

    // Fetch the created message with associations
    const createdMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.status(201).json(createdMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Send message to multiple recipients (teacher functionality)
router.post('/send-message', authenticateToken, async (req, res) => {
  try {
    const { recipientType, recipients, subject, content, messageType, priority, recipientId } = req.body;
    const senderId = req.user.id;

    // Validate teacher or parent role
    if (req.user.role !== 'teacher' && req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied. Only teachers and parents can send messages.' });
    }

    // If recipientId is provided, send direct message to that recipient
    if (recipientId) {
      console.log('Sending direct message to recipientId:', recipientId);
      
      // Validate recipient exists and has appropriate role
      const recipientRole = req.user.role === 'teacher' ? 'parent' : 'teacher';
      const recipient = await User.findOne({
        where: { id: recipientId, role: recipientRole }
      });

      if (!recipient) {
        console.log(`${recipientRole} not found for recipientId:`, recipientId);
        return res.status(404).json({ error: `${recipientRole} not found` });
      }

      console.log('Found recipient:', recipient.firstName, recipient.lastName);

      // Find a student associated with this parent and teacher
      let student = null;
      if (req.user.role === 'teacher') {
        student = await Student.findOne({
          where: { 
            parent_id: recipientId,
            teacher_id: senderId 
          }
        });
      } else {
        student = await Student.findOne({
          where: { 
            parent_id: senderId,
            teacher_id: recipientId 
          }
        });
      }

      console.log('Found student:', student ? `${student.firstName} ${student.lastName}` : 'No student found');

      const message = await Message.create({
        senderId,
        recipientId,
        studentId: student?.id,
        subject: subject || 'Message from teacher',
        content,
        messageType: messageType || 'general',
        priority: priority || 'normal'
      });

      console.log('Created message with ID:', message.id);

      // Fetch the created message with associations
      const createdMessage = await Message.findByPk(message.id, {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'role']
          },
          {
            model: User,
            as: 'recipient',
            attributes: ['id', 'firstName', 'lastName', 'role']
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      return res.status(201).json({
        success: true,
        message: createdMessage
      });
    }

    // Original broadcast/individual functionality
    let targetRecipients = [];

    if (recipientType === 'broadcast') {
      // Get all students assigned to this teacher
      const students = await Student.findAll({
        where: { teacher_id: senderId },
        include: [
          {
            model: User,
            as: 'parent',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      targetRecipients = students
        .filter(student => student.parent)
        .map(student => ({
          studentId: student.id,
          recipientId: student.parent.id,
          studentName: `${student.firstName} ${student.lastName}`
        }));
    } else if (recipientType === 'individual' && recipients && recipients.length > 0) {
      // Get specific students and their parents
      const students = await Student.findAll({
        where: { 
          id: recipients,
          teacher_id: senderId 
        },
        include: [
          {
            model: User,
            as: 'parent',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      targetRecipients = students
        .filter(student => student.parent)
        .map(student => ({
          studentId: student.id,
          recipientId: student.parent.id,
          studentName: `${student.firstName} ${student.lastName}`
        }));
    }

    if (targetRecipients.length === 0) {
      return res.status(400).json({ error: 'No valid recipients found' });
    }

    // Create messages for all recipients
    const messages = [];
    for (const recipient of targetRecipients) {
      const message = await Message.create({
        senderId,
        recipientId: recipient.recipientId,
        studentId: recipient.studentId,
        subject,
        content,
        messageType: messageType || 'general',
        priority: priority || 'normal'
      });

      messages.push({
        id: message.id,
        studentName: recipient.studentName,
        recipientId: recipient.recipientId
      });
    }

    res.status(201).json({
      success: true,
      message: `Message sent to ${messages.length} recipient(s)`,
      messages
    });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ error: 'Failed to send messages' });
  }
});

// Mark message as read
router.patch('/messages/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [
          { senderId: userId },
          { recipientId: userId }
        ]
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.update({
      isRead: true,
      readAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Archive message
router.patch('/messages/:messageId/archive', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [
          { senderId: userId },
          { recipientId: userId }
        ]
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.update({ isArchived: true });

    res.json({ success: true });
  } catch (error) {
    console.error('Error archiving message:', error);
    res.status(500).json({ error: 'Failed to archive message' });
  }
});

// Get available recipients (for teachers to send messages to parents)
router.get('/recipients', authenticateToken, requireRole(['teacher', 'school_admin']), async (req, res) => {
  try {
    const { studentId } = req.query;
    
    if (studentId) {
      // Get parent of specific student
      const student = await Student.findByPk(studentId, {
        include: [
          {
            model: User,
            as: 'parent',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json([student.parent]);
    } else {
      // Get all parents in the teacher's school
      const students = await Student.findAll({
        where: { schoolId: req.user.schoolId },
        include: [
          {
            model: User,
            as: 'parent',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            where: { isActive: true }
          }
        ]
      });

      const parents = students
        .map(student => student.parent)
        .filter((parent, index, arr) => 
          arr.findIndex(p => p.id === parent.id) === index
        );

      res.json(parents);
    }
  } catch (error) {
    console.error('Error fetching recipients:', error);
    res.status(500).json({ error: 'Failed to fetch recipients' });
  }
});

// Get students for message context (for teachers)
router.get('/students', authenticateToken, requireRole(['teacher', 'school_admin']), async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { schoolId: req.user.schoolId },
      attributes: ['id', 'firstName', 'lastName', 'grade'],
      order: [['firstName', 'ASC']]
    });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get conversations for teachers and parents (grouped by participant)
router.get('/conversations', authenticateToken, requireRole(['teacher', 'parent']), async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const currentUserId = req.user.id;
    
    // Get all messages where current user is sender or recipient
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId },
          { recipientId: currentUserId }
        ],
        isArchived: false
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group messages by participant (conversation)
    const conversationsMap = new Map();
    
    messages.forEach(message => {
      // Determine the other participant (non-current user)
      const currentUser = req.user;
      const otherParticipant = message.sender.id === currentUser.id ? message.recipient : message.sender;
      const student = message.student;
      
      if (!conversationsMap.has(otherParticipant.id)) {
        const conversationName = currentUser.role === 'teacher' ? 
          `${otherParticipant.firstName} ${otherParticipant.lastName}` : 
          `${otherParticipant.firstName} ${otherParticipant.lastName}`;
        
        conversationsMap.set(otherParticipant.id, {
          id: otherParticipant.id,
          teacherName: currentUser.role === 'parent' ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : '',
          parentName: currentUser.role === 'teacher' ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : '',
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: 0,
          messages: []
        });
      }
      
      const conversation = conversationsMap.get(otherParticipant.id);
      conversation.messages.push(message);
      
      // Update unread count for messages sent to current user
      if (message.recipientId === currentUser.id && !message.isRead) {
        conversation.unreadCount++;
      }
      
      // Update last message if this is more recent
      if (new Date(message.createdAt) > new Date(conversation.lastMessageTime)) {
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.createdAt;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    
    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', authenticateToken, requireRole(['teacher', 'parent']), async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, recipientId: conversationId },
          { senderId: conversationId, recipientId: currentUserId }
        ],
        isArchived: false
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ error: 'Failed to fetch conversation messages' });
  }
});

// Mark message as read (PUT method for consistency)
router.put('/messages/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [
          { senderId: userId },
          { recipientId: userId }
        ]
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.update({
      isRead: true,
      readAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router; 