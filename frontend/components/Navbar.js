'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearStoredUser, getStoredUser } from '../services/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'All Tasks', href: '/tasks' },
    { label: 'Blocked Tasks', href: '/blocked-tasks' },
    {
      label: currentUser?.role === 'Admin' ? 'Create Task' : 'Submit Task',
      href: '/create-task'
    }
  ];

  if (currentUser?.role !== 'Admin') {
    navItems.splice(1, 0, { label: 'My Tasks', href: '/my-tasks' });
  }

  if (currentUser?.role === 'Admin') {
    navItems.splice(3, 0, { label: 'Users', href: '/users' });
  }

  function handleLogout() {
    clearStoredUser();
    setCurrentUser(null);
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-badge" aria-hidden="true">✓</div>
        <span>Smart Task Manager</span>
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="user-info">
        <div className="user-avatar">{currentUser?.name?.[0] || 'U'}</div>
        <span>{currentUser?.name || 'User'}</span>
        <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
