const {
  tasks,
  users,
  taskAttachments,
  generateId,
  isTaskBlocked,
  getTasksByUserId
} = require('../data/store');

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);

function validateEvidence(payload) {
  if (payload.completedTaskLink) {
    try {
      const link = new URL(payload.completedTaskLink);
      if (!['http:', 'https:'].includes(link.protocol)) {
        return 'Completed work link must use http or https.';
      }
    } catch (error) {
      return 'Enter a valid completed work URL.';
    }
  }

  if (payload.attachmentUpload) {
    const { name, type, data } = payload.attachmentUpload;
    if (!name || !ALLOWED_ATTACHMENT_TYPES.has(type) || typeof data !== 'string') {
      return 'Choose a supported file type (PDF, image, text, ZIP, Word, PowerPoint, or Excel).';
    }

    const match = data.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match || match[1] !== type) {
      return 'The uploaded file could not be read. Please select it again.';
    }

    const byteLength = Buffer.from(match[2], 'base64').length;
    if (byteLength === 0 || byteLength > MAX_ATTACHMENT_BYTES) {
      return 'Attachment must be smaller than 2 MB.';
    }
  }

  return null;
}

function validateTaskPayload(task, isUpdate = false) {
  const title = String(task?.title || '').trim();
  const description = String(task?.description || '').trim();
  const priority = task?.priority;
  const status = task?.status;
  const assignedTo = task?.assignedTo;
  const dependency = task?.dependency;

  if (!title) {
    return { valid: false, message: 'Title cannot be empty.' };
  }

  if (!description) {
    return { valid: false, message: 'Description cannot be empty.' };
  }

  if (!['Low', 'Medium', 'High'].includes(priority)) {
    return { valid: false, message: 'Priority must be Low, Medium, or High.' };
  }

  if (!['To Do', 'In Progress', 'Done'].includes(status)) {
    return { valid: false, message: 'Status must be To Do, In Progress, or Done.' };
  }

  if (!assignedTo || !users.some((user) => user.id === assignedTo)) {
    return { valid: false, message: 'Assigned user must exist.' };
  }

  if (dependency && dependency === task.id && !isUpdate) {
    return { valid: false, message: 'Task cannot depend on itself.' };
  }

  if (dependency && !tasks.some((item) => item.id === dependency)) {
    return { valid: false, message: 'Dependency must exist if provided.' };
  }

  if (dependency && dependency === task.id) {
    return { valid: false, message: 'Task cannot depend on itself.' };
  }

  if (status === 'Done' && isTaskBlocked({ ...task, status }, tasks)) {
    return {
      valid: false,
      message: 'This task is blocked. Complete the dependency first.'
    };
  }

  return { valid: true };
}

function listTasks(req, res) {
  return res.status(200).json(tasks);
}

function getTaskById(req, res) {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.status(200).json(task);
}

function createTask(req, res) {
  const payload = {
    ...(req.body || {}),
    assignedTo: req.user.role === 'Admin' ? req.body?.assignedTo : req.user.id
  };
  const validation = validateTaskPayload({ ...payload, id: 'temp' });

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  const evidenceError = validateEvidence(payload);
  if (evidenceError) {
    return res.status(400).json({ message: evidenceError });
  }

  const newTask = {
    id: generateId('task'),
    title: String(payload.title).trim(),
    description: String(payload.description || '').trim(),
    priority: payload.priority,
    status: payload.status,
    assignedTo: payload.assignedTo,
    dependency: payload.dependency || null,
    completedTaskLink: payload.completedTaskLink?.trim() || null,
    attachment: null,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  if (payload.attachmentUpload) {
    const attachmentId = generateId('attachment');
    const { name, type, data } = payload.attachmentUpload;
    const base64 = data.slice(data.indexOf(',') + 1);
    taskAttachments.set(attachmentId, {
      buffer: Buffer.from(base64, 'base64'),
      name: name.replace(/[\\/\r\n"]/g, '_'),
      type
    });
    newTask.attachment = { id: attachmentId, name, type };
  }

  const blocked = isTaskBlocked(newTask, tasks);
  if (blocked && newTask.status === 'Done') {
    return res.status(400).json({ message: 'This task is blocked. Complete the dependency first.' });
  }

  tasks.push(newTask);
  return res.status(201).json({ message: 'Task created successfully.', task: newTask });
}

function updateTask(req, res) {
  const taskIndex = tasks.findIndex((item) => item.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const task = tasks[taskIndex];
  if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
    return res.status(403).json({ message: 'You can only update tasks assigned to you.' });
  }

  const { attachmentUpload, ...taskUpdates } = req.body || {};
  const nextTask = {
    ...task,
    ...taskUpdates,
    assignedTo: req.user.role === 'Admin' ? (req.body?.assignedTo || task.assignedTo) : req.user.id,
    id: task.id,
    createdAt: task.createdAt
  };

  if (nextTask.dependency === nextTask.id) {
    return res.status(400).json({ message: 'Task cannot depend on itself.' });
  }

  if (nextTask.dependency && !tasks.some((item) => item.id === nextTask.dependency)) {
    return res.status(400).json({ message: 'Dependency must exist if provided.' });
  }

  const evidenceError = validateEvidence(req.body || {});
  if (evidenceError) {
    return res.status(400).json({ message: evidenceError });
  }

  nextTask.completedTaskLink = req.body?.completedTaskLink?.trim() || null;
  if (attachmentUpload) {
    const oldAttachmentId = nextTask.attachment?.id;
    if (oldAttachmentId) taskAttachments.delete(oldAttachmentId);
    const attachmentId = generateId('attachment');
    const { name, type, data } = attachmentUpload;
    taskAttachments.set(attachmentId, {
      buffer: Buffer.from(data.slice(data.indexOf(',') + 1), 'base64'),
      name: name.replace(/[\\/\r\n"]/g, '_'),
      type
    });
    nextTask.attachment = { id: attachmentId, name, type };
  }

  if (nextTask.status === 'Done' && isTaskBlocked(nextTask, tasks)) {
    return res.status(400).json({ message: 'This task is blocked. Complete the dependency first.' });
  }

  tasks[taskIndex] = nextTask;
  return res.status(200).json({ message: 'Task updated successfully.', task: nextTask });
}

function deleteTask(req, res) {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const task = tasks[taskIndex];
  if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete tasks assigned to you.' });
  }

  const dependentTasks = tasks.filter((item) => item.dependency === taskId);
  if (task.attachment?.id) taskAttachments.delete(task.attachment.id);

  dependentTasks.forEach((dependentTask) => {
    dependentTask.dependency = null;
  });

  tasks.splice(taskIndex, 1);
  return res.status(200).json({ message: 'Task deleted successfully.' });
}

function getUserTasks(req, res) {
  const { userId } = req.params;

  if (req.user.role !== 'Admin' && req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  return res.status(200).json(getTasksByUserId(userId));
}

function getBlockedTasks(req, res) {
  const blockedTasks = tasks.filter((task) => isTaskBlocked(task, tasks));
  return res.status(200).json(blockedTasks);
}

function downloadTaskAttachment(req, res) {
  const task = tasks.find((item) => item.id === req.params.id);
  if (!task?.attachment?.id) {
    return res.status(404).json({ message: 'Task attachment not found.' });
  }

  const attachment = taskAttachments.get(task.attachment.id);
  if (!attachment) {
    return res.status(404).json({ message: 'Task attachment is no longer available.' });
  }

  res.setHeader('Content-Type', attachment.type);
  res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
  return res.status(200).send(attachment.buffer);
}

function markTaskDone(req, res) {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
    return res.status(403).json({ message: 'You can only complete tasks assigned to you.' });
  }

  if (isTaskBlocked(task, tasks)) {
    return res.status(400).json({
      message: 'This task is blocked. Complete the dependency first.'
    });
  }

  task.status = 'Done';
  return res.status(200).json({ message: 'Task marked as completed.', task });
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getUserTasks,
  getBlockedTasks,
  downloadTaskAttachment,
  markTaskDone
};
