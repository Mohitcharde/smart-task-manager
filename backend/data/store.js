const users = [];
const tasks = [];
const taskAttachments = new Map();

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function initializeSampleData() {
  if (users.length > 0 || tasks.length > 0) {
    return;
  }

  users.push(
    { id: 'admin1', name: 'Admin', email: 'admin@example.com', role: 'Admin' },
    { id: 'user1', name: 'Siddhi', email: 'siddhi@example.com', role: 'User' },
    { id: 'user2', name: 'Mohit', email: 'mohit@example.com', role: 'User' }
  );

  tasks.push(
    {
      id: 'task1',
      title: 'Design Homepage',
      description: 'Create the homepage wireframe and layout.',
      priority: 'High',
      status: 'Done',
      assignedTo: 'user1',
      dependency: null,
      createdAt: '2026-10-04'
    },
    {
      id: 'task2',
      title: 'Develop Homepage',
      description: 'Implement the homepage UI based on the approved design.',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'user2',
      dependency: 'task1',
      createdAt: '2026-10-04'
    },
    {
      id: 'task3',
      title: 'Create Login Page',
      description: 'Build login screen and mock authentication flow.',
      priority: 'Medium',
      status: 'To Do',
      assignedTo: 'user2',
      dependency: null,
      createdAt: '2026-10-04'
    },
    {
      id: 'task4',
      title: 'Test Application',
      description: 'Verify app flows and check for edge cases.',
      priority: 'Medium',
      status: 'To Do',
      assignedTo: 'user1',
      dependency: 'task2',
      createdAt: '2026-10-04'
    },
    {
      id: 'task5',
      title: 'Deploy Application',
      description: 'Prepare for release and deployment.',
      priority: 'Low',
      status: 'To Do',
      assignedTo: 'user2',
      dependency: 'task4',
      createdAt: '2026-10-04'
    }
  );
}

function isTaskBlocked(task, allTasks = tasks) {
  if (!task || !task.dependency) {
    return false;
  }

  const dependencyTask = allTasks.find((item) => item.id === task.dependency);

  if (!dependencyTask) {
    return false;
  }

  return dependencyTask.status !== 'Done';
}

function findUserById(userId) {
  return users.find((user) => user.id === userId);
}

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).trim().toLowerCase());
}

function getTasksByUserId(userId) {
  return tasks.filter((task) => task.assignedTo === userId);
}

module.exports = {
  users,
  tasks,
  taskAttachments,
  initializeSampleData,
  generateId,
  isTaskBlocked,
  findUserById,
  findUserByEmail,
  getTasksByUserId
};
