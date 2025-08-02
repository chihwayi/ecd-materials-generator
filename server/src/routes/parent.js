const express = require('express');
const router = express.Router();
const { authMiddleware: authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { User, Student, Assignment, StudentAssignment, Progress, Class } = require('../models');
const { Op } = require('sequelize');

// Get parent's children
router.get('/children', authenticateToken, requireRole(['parent']), async (req, res) => {
  try {
    const children = await Student.findAll({
      where: { parentId: req.user.id },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['firstName', 'ASC']]
    });

    res.json({ children });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

// Get all assignments for parent's children
router.get('/assignments', authenticateToken, requireRole(['parent']), async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Get all children of the parent
    const children = await Student.findAll({
      where: { parentId },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        }
      ]
    });

    if (children.length === 0) {
      return res.json({ assignments: [] });
    }

    const childrenIds = children.map(child => child.id);
    
    // Get all assignments for the children
    const studentAssignments = await StudentAssignment.findAll({
      where: { studentId: childrenIds },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'description', 'dueDate', 'type', 'materials', 'customTasks']
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: Class,
              as: 'class',
              attributes: ['name', 'grade']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const assignments = studentAssignments.map(sa => ({
      id: sa.id,
      studentId: sa.studentId,
      assignmentId: sa.assignmentId,
      status: sa.status,
      submittedAt: sa.submittedAt,
      grade: sa.grade,
      gradedAt: sa.gradedAt,
      parentViewed: sa.parentViewed || false,
      assignment: sa.assignment,
      student: sa.student
    }));

    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching parent assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get parent dashboard statistics
router.get('/dashboard/stats', authenticateToken, requireRole(['parent']), async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Get all children of the parent
    const children = await Student.findAll({
      where: { parentId },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    // If no children found, return empty data
    if (children.length === 0) {
      return res.json({
        childrenStats: [],
        overallStats: {
          totalChildren: 0,
          totalAssignments: 0,
          totalCompleted: 0,
          totalPending: 0,
          totalOverdue: 0,
          overallCompletionRate: 0
        },
        recentActivities: [],
        notifications: []
      });
    }

    const childrenIds = children.map(child => child.id);
    
    // Get all assignments for the children
    const studentAssignments = await StudentAssignment.findAll({
      where: { studentId: childrenIds },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'description', 'dueDate', 'type', 'materials', 'customTasks']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate statistics for each child
    const childrenStats = children.map(child => {
      const childAssignments = studentAssignments.filter(sa => sa.studentId === child.id);
      
      const totalAssignments = childAssignments.length;
      
      // Fix: Consider assignments with grades as completed
      const completedAssignments = childAssignments.filter(sa => 
        sa.status === 'completed' || sa.grade !== null
      ).length;
      
      // Fix: Only count truly pending assignments (no grade, not completed)
      const pendingAssignments = childAssignments.filter(sa => 
        sa.status === 'assigned' && sa.grade === null
      ).length;
      
      const overdueAssignments = childAssignments.filter(sa => {
        const dueDate = new Date(sa.assignment.dueDate);
        const now = new Date();
        return (sa.status === 'assigned' || sa.status === 'in_progress') && dueDate < now;
      }).length;

      const gradedAssignments = childAssignments.filter(sa => sa.grade !== null).length;
      const averageGrade = gradedAssignments > 0 
        ? childAssignments
            .filter(sa => sa.grade !== null)
            .reduce((sum, sa) => sum + sa.grade, 0) / gradedAssignments
        : 0;

      return {
        childId: child.id,
        childName: `${child.firstName} ${child.lastName}`,
        className: child.class?.name || 'Not assigned',
        teacherName: child.assignedTeacher 
          ? `${child.assignedTeacher.firstName} ${child.assignedTeacher.lastName}`
          : 'Not assigned',
        totalAssignments,
        completedAssignments,
        pendingAssignments,
        overdueAssignments,
        gradedAssignments,
        averageGrade: Math.round(averageGrade),
        completionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0
      };
    });

    // Overall statistics
    const totalAssignments = studentAssignments.length;
    const totalCompleted = studentAssignments.filter(sa => 
      sa.status === 'completed' || sa.grade !== null
    ).length;
    const totalPending = studentAssignments.filter(sa => 
      sa.status === 'assigned' && sa.grade === null
    ).length;
    const totalOverdue = studentAssignments.filter(sa => {
      const dueDate = new Date(sa.assignment.dueDate);
      const now = new Date();
      return (sa.status === 'assigned' || sa.status === 'in_progress') && dueDate < now;
    }).length;

    const overallStats = {
      totalChildren: children.length,
      totalAssignments,
      totalCompleted,
      totalPending,
      totalOverdue,
      overallCompletionRate: totalAssignments > 0 ? Math.round((totalCompleted / totalAssignments) * 100) : 0
    };

    // Recent activities (last 7 days) - Fix status display
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivities = studentAssignments
      .filter(sa => sa.submittedAt && new Date(sa.submittedAt) >= sevenDaysAgo)
      .slice(0, 5)
      .map(sa => {
        // Fix: Determine correct status for display
        let displayStatus = sa.status;
        if (sa.grade !== null) {
          displayStatus = 'completed'; // Show as completed if graded
        } else if (sa.status === 'assigned' && sa.submittedAt) {
          displayStatus = 'submitted'; // Show as submitted if has submission date
        }
        
        return {
          id: sa.id,
          childName: children.find(c => c.id === sa.studentId)?.firstName || 'Unknown',
          assignmentTitle: sa.assignment.title,
          status: displayStatus,
          submittedAt: sa.submittedAt,
          grade: sa.grade,
          gradedAt: sa.gradedAt,
          studentId: sa.studentId,
          parentViewed: sa.parentViewed || false
        };
      });

    // Notifications
    const notifications = [];
    
    // Overdue assignments
    const overdueCount = studentAssignments.filter(sa => {
      const dueDate = new Date(sa.assignment.dueDate);
      const now = new Date();
      return (sa.status === 'assigned' || sa.status === 'in_progress') && dueDate < now;
    }).length;
    
    if (overdueCount > 0) {
      notifications.push({
        type: 'warning',
        message: `${overdueCount} assignment(s) overdue`,
        icon: '⚠️'
      });
    }

    // New assignments (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const newAssignments = studentAssignments.filter(sa => 
      new Date(sa.createdAt) >= threeDaysAgo && sa.status === 'assigned'
    ).length;
    
    if (newAssignments > 0) {
      notifications.push({
        type: 'info',
        message: `${newAssignments} new assignment(s)`,
        icon: '📝'
      });
    }

    // Graded assignments
    const unviewedGraded = studentAssignments.filter(sa => 
      sa.grade !== null && !sa.parentViewed
    ).length;
    
    if (unviewedGraded > 0) {
      notifications.push({
        type: 'success',
        message: `${unviewedGraded} graded assignment(s) to review`,
        icon: '✅'
      });
    }

    res.json({
      childrenStats,
      overallStats,
      recentActivities,
      notifications
    });
  } catch (error) {
    console.error('Error fetching parent dashboard stats:', error);
    
    // Return fallback data instead of error
    res.json({
      childrenStats: [],
      overallStats: {
        totalChildren: 0,
        totalAssignments: 0,
        totalCompleted: 0,
        totalPending: 0,
        totalOverdue: 0,
        overallCompletionRate: 0
      },
      recentActivities: [],
      notifications: [
        {
          type: 'info',
          message: 'No children assigned to your account yet',
          icon: '👶'
        }
      ]
    });
  }
});

// Mark assignment as viewed by parent
router.post('/assignment/:assignmentId/viewed', authenticateToken, requireRole(['parent']), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId } = req.body;

    // Verify the assignment belongs to one of the parent's children
    const child = await Student.findOne({
      where: { 
        id: studentId,
        parentId: req.user.id 
      }
    });

    if (!child) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await StudentAssignment.update(
      { parentViewed: true },
      { 
        where: { 
          assignmentId,
          studentId 
        }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking assignment as viewed:', error);
    res.status(500).json({ error: 'Failed to mark assignment as viewed' });
  }
});

module.exports = router;