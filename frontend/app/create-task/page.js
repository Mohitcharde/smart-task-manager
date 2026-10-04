'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import TaskForm from '../../components/TaskForm';
import { apiFetch, getStoredUser } from '../../services/api';

export default function CreateTaskPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    const loadTasks = apiFetch('/tasks').then((taskResponse) => {
      setTasks(taskResponse || []);
    });
    const loadUsers = currentUser.role === 'Admin'
      ? apiFetch('/users').then((userResponse) => setUsers(userResponse || []))
      : Promise.resolve();

    Promise.all([loadTasks, loadUsers]).catch((error) => {
      setMessage(error.message || 'Unable to load task form data.');
    });
  }, [router]);

  async function handleSubmit(payload) {
    const response = await apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    setMessageType('success');
    setMessage(user?.role === 'Admin'
      ? response.message || 'Task created successfully.'
      : 'Task submitted successfully.');
    setTasks((currentTasks) => [response.task, ...currentTasks]);
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h1 className="section-heading">{user?.role === 'Admin' ? 'Create New Task' : 'Submit a Task'}</h1>
        <p className="section-subtitle">
          {user?.role === 'Admin'
            ? 'Add a new task with assignee, priority, and dependencies.'
            : 'Submit a task for yourself with its priority and dependencies.'}
        </p>

        {message ? <div className={`form-message ${messageType}`}>{message}</div> : null}

        {user ? (
          <TaskForm
            currentUser={user}
            users={users}
            tasks={tasks}
            onSubmit={handleSubmit}
            buttonLabel={user?.role === 'Admin' ? 'Create Task' : 'Submit Task'}
          />
        ) : <div className="empty-state">Loading your account...</div>}
      </div>
    </div>
  );
}
