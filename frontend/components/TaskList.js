'use client';

import TaskCard from './TaskCard';

export default function TaskList({ tasks, currentUser, onDelete, onEdit, onComplete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>There are no tasks available for this view.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          currentUser={currentUser}
          onDelete={onDelete}
          onEdit={onEdit}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}
