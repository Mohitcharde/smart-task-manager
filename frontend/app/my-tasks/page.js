'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import TaskList from '../../components/TaskList';
import { apiFetch, getStoredUser } from '../../services/api';

export default function MyTasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  async function loadMyTasks() {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    try {
      const response = await apiFetch(`/users/${currentUser.id}/tasks`);
      setTasks(response || []);
    } catch (error) {
      setTasks([]);
    }
  }

  useEffect(() => {
    loadMyTasks();
  }, [router]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h1 className="section-heading">My Tasks</h1>
        <p className="section-subtitle">Tasks assigned to {user?.name || 'you'}.</p>
        <TaskList
          tasks={tasks}
          currentUser={user}
          onDelete={() => {}}
          onEdit={() => {}}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
