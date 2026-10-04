'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import TaskList from '../../components/TaskList';
import { apiFetch, getStoredUser } from '../../services/api';

export default function BlockedTasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    apiFetch('/tasks/blocked')
      .then((response) => setTasks(response || []))
      .catch(() => setTasks([]));
  }, [router]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h1 className="section-heading">Blocked Tasks</h1>
        <p className="section-subtitle">Tasks waiting for their dependency to be completed.</p>
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
