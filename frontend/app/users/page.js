'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import UserCard from '../../components/UserCard';
import { apiFetch, getStoredUser } from '../../services/api';

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    if (currentUser.role !== 'Admin') {
      setMessage('Access Denied. Only administrators can view all users.');
      setUsers([]);
      return;
    }

    apiFetch('/users')
      .then((response) => setUsers(response || []))
      .catch((error) => setMessage(error.message || 'Access denied. Admin access required.'));
  }, [router]);

  if (user && user.role !== 'Admin') {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="page-container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Only administrators can view all users.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h1 className="section-heading">Users</h1>
        <p className="section-subtitle">Manage and review all platform users.</p>

        {message ? <div className="form-message error">{message}</div> : null}

        {users.length === 0 && !message ? (
          <div className="empty-state">
            <h3>No users available</h3>
          </div>
        ) : null}

        <div className="user-list">
          {users.map((item) => (
            <UserCard key={item.id} user={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
