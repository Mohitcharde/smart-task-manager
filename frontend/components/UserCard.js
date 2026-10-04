'use client';

export default function UserCard({ user }) {
  return (
    <div className="user-card">
      <div className="task-title">{user.name}</div>
      <div className="task-meta">{user.email}</div>
      <div className="task-meta">Role: {user.role}</div>
    </div>
  );
}
