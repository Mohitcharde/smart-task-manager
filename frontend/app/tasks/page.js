'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import TaskList from '../../components/TaskList';
import FilterBar from '../../components/FilterBar';
import TaskForm from '../../components/TaskForm';
import { apiFetch, getStoredUser } from '../../services/api';

const emptyTaskValues = Object.freeze({});

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState('');

  async function loadData() {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    try {
      const [taskData, userData] = await Promise.all([
        apiFetch('/tasks'),
        currentUser.role === 'Admin' ? apiFetch('/users') : Promise.resolve([])
      ]);

      setTasks(taskData || []);
      setUsers(userData || []);
    } catch (error) {
      setTasks([]);
      setUsers([]);
    }
  }

  useEffect(() => {
    loadData();
  }, [router]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority = priority === 'All' || task.priority === priority;
      const matchesStatus = status === 'All' || task.status === status;
      return matchesPriority && matchesStatus;
    });
  }, [tasks, priority, status]);

  async function handleCreateOrUpdate(payload) {
    try {
      if (editingTask) {
        const response = await apiFetch(`/tasks/${editingTask.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setMessage(response.message || 'Task updated successfully.');
      } else {
        const response = await apiFetch('/tasks', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setMessage(response.message || 'Task created successfully.');
      }

      setEditingTask(null);
      loadData();
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' });
      setMessage(response.message || 'Task deleted successfully.');
      loadData();
    } catch (error) {
      setMessage(error.message || 'Unable to delete task.');
    }
  }

  async function handleComplete(task) {
    try {
      const response = await apiFetch(`/tasks/${task.id}/done`, { method: 'PATCH' });
      setMessage(response.message || 'Task marked as completed.');
      loadData();
    } catch (error) {
      setMessage(error.message || 'Task cannot be completed yet.');
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h1 className="section-heading">All Tasks</h1>
        <p className="section-subtitle">Manage tasks, priorities, and dependencies.</p>

        {message ? <div className="form-message success">{message}</div> : null}

        <FilterBar
          priority={priority}
          status={status}
          onPriorityChange={setPriority}
          onStatusChange={setStatus}
        />

        <div style={{ marginBottom: 24 }}>
          <TaskForm
            currentUser={user}
            users={users}
            tasks={tasks}
            initialValues={editingTask || emptyTaskValues}
            buttonLabel={editingTask
              ? 'Update Task'
              : user?.role === 'Admin' ? 'Create Task' : 'Submit Task'}
            onSubmit={handleCreateOrUpdate}
          />
        </div>

        <TaskList
          tasks={filteredTasks}
          currentUser={user}
          onDelete={handleDelete}
          onEdit={(task) => setEditingTask(task)}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
