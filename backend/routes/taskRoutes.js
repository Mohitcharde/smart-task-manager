const express = require('express');
const {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getUserTasks,
  getBlockedTasks,
  downloadTaskAttachment,
  markTaskDone
} = require('../controllers/taskController');
const { requireUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/tasks', requireUser, listTasks);
router.get('/tasks/blocked', requireUser, getBlockedTasks);
router.get('/tasks/:id/attachment', requireUser, downloadTaskAttachment);
router.get('/tasks/:id', requireUser, getTaskById);
router.post('/tasks', requireUser, createTask);
router.put('/tasks/:id', requireUser, updateTask);
router.delete('/tasks/:id', requireUser, deleteTask);
router.patch('/tasks/:id/done', requireUser, markTaskDone);
router.get('/users/:userId/tasks', requireUser, getUserTasks);

module.exports = router;
