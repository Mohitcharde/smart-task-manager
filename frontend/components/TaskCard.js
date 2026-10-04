'use client';

import { API_BASE, getAuthHeaders } from '../services/api';

export default function TaskCard({ task, currentUser, onDelete, onEdit, onComplete }) {
  const isOwner = currentUser?.id === task.assignedTo || currentUser?.role === 'Admin';

  async function downloadAttachment() {
    try {
      const response = await fetch(`${API_BASE}/tasks/${task.id}/attachment`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Unable to download attachment.');
      }

      const fileUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = task.attachment.name;
      link.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      window.alert(error.message || 'Unable to download attachment.');
    }
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div>
          <div className="task-title">{task.title}</div>
          <div className="task-meta">
            {task.description}
          </div>
          <div className="task-meta">
            Assigned to: {task.assignedTo || 'Unassigned'} • Created: {task.createdAt}
          </div>
        </div>
        <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>

      <div className="task-meta">
        Status: <span className={`badge ${task.status.toLowerCase().replace(/\s+/g, '-')}`}>{task.status}</span>
      </div>

      <div className="task-meta">
        Dependency: {task.dependency || 'No Dependency'}
      </div>
      {task.completedTaskLink ? (
        <div className="task-meta">
          Completed work: <a className="evidence-link" href={task.completedTaskLink} target="_blank" rel="noreferrer">Open link</a>
        </div>
      ) : null}
      {task.attachment ? (
        <div className="task-meta">
          Attachment: <button type="button" className="evidence-link-button" onClick={downloadAttachment}>{task.attachment.name}</button>
        </div>
      ) : null}

      <div className="task-actions">
        {isOwner ? (
          <>
            <button type="button" onClick={() => onEdit(task)}>Edit</button>
            <button type="button" className="complete-btn" onClick={() => onComplete(task)}>Mark as Done</button>
            <button type="button" className="danger-btn" onClick={() => onDelete(task.id)}>Delete</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
