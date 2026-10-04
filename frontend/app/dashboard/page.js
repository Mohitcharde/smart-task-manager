'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import TaskList from '../../components/TaskList';
import { apiFetch, getStoredUser } from '../../services/api';

export default function DashboardPage() {
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

    apiFetch('/tasks')
      .then((response) => setTasks(response || []))
      .catch(() => setTasks([]));
  }, [router]);

  const total = tasks.length;
  const todo = tasks.filter((task) => task.status === 'To Do').length;
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
  const completed = tasks.filter((task) => task.status === 'Done').length;
  const blocked = tasks.filter((task) => task.dependency && task.status !== 'Done').length;
  const recentTasks = user?.role === 'Admin'
    ? tasks.slice(0, 5)
    : tasks.filter((task) => task.assignedTo === user?.id).slice(0, 5);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name || 'User'}</h1>
            <p>Here is a summary of your project progress and task dependencies.</p>
          </div>
        </div>

        <div className="stats-grid">
          <DashboardCard label="Total Tasks" value={total} tone="blue" />
          <DashboardCard label="To Do" value={todo} tone="orange" />
          <DashboardCard label="In Progress" value={inProgress} tone="orange" />
          <DashboardCard label="Completed" value={completed} tone="green" />
          <DashboardCard label="Blocked" value={blocked} tone="red" />
        </div>

        <h2 className="section-heading">{user?.role === 'Admin' ? 'Recent Tasks' : 'My Recent Tasks'}</h2>
        <p className="section-subtitle">Latest tasks from your workload.</p>
        <TaskList
          tasks={recentTasks}
          currentUser={user}
          onDelete={() => {}}
          onEdit={() => {}}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
