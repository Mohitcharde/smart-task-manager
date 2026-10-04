'use client';

import { useEffect, useState } from 'react';

const defaultValues = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  assignedTo: '',
  dependency: '',
  completedTaskLink: ''
};

const emptyInitialValues = Object.freeze({});
const maxAttachmentSize = 2 * 1024 * 1024;
const allowedAttachmentTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);

export default function TaskForm({ users = [], tasks = [], currentUser, initialValues = emptyInitialValues, onSubmit, buttonLabel = 'Create Task' }) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialValues,
    assignedTo: initialValues.assignedTo || currentUser?.id || ''
  });
  const [error, setError] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);

  useEffect(() => {
    setForm({
      ...defaultValues,
      ...initialValues,
      assignedTo: initialValues.assignedTo || currentUser?.id || ''
    });
    setAttachmentFile(null);
  }, [initialValues, currentUser]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAttachmentChange(event) {
    const file = event.target.files?.[0] || null;
    setError('');

    if (file && file.size > maxAttachmentSize) {
      setAttachmentFile(null);
      event.target.value = '';
      setError('Attachment must be smaller than 2 MB.');
      return;
    }

    if (file && !allowedAttachmentTypes.has(file.type)) {
      setAttachmentFile(null);
      event.target.value = '';
      setError('Choose a PDF, image, text, ZIP, Word, PowerPoint, or Excel file.');
      return;
    }

    setAttachmentFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      assignedTo: currentUser?.role === 'Admin' ? form.assignedTo : currentUser?.id,
      dependency: form.dependency === 'none' ? null : form.dependency || null
    };

    if (!payload.title.trim() || !payload.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    if (payload.dependency === payload.id && payload.dependency) {
      setError('Task cannot depend on itself.');
      return;
    }

    if (!payload.assignedTo) {
      setError('A task must be assigned to a user.');
      return;
    }

    if (payload.completedTaskLink) {
      try {
        const url = new URL(payload.completedTaskLink);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch (invalidUrl) {
        setError('Enter a valid completed work link beginning with http:// or https://.');
        return;
      }
    }

    try {
      if (attachmentFile) {
        payload.attachmentUpload = {
          name: attachmentFile.name,
          type: attachmentFile.type,
          data: await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Unable to read the selected file.'));
            reader.readAsDataURL(attachmentFile);
          })
        };
      }

      await onSubmit(payload);
      setForm({
        ...defaultValues,
        assignedTo: currentUser?.id || ''
      });
      setAttachmentFile(null);
      const input = document.getElementById('taskAttachment');
      if (input) input.value = '';
    } catch (submitError) {
      setError(submitError.message || 'Unable to save task.');
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-grid-full">
          <label className="field-label" htmlFor="title">Task Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Build Homepage" />
        </div>

        <div className="form-grid-full">
          <label className="field-label" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Add task details" />
        </div>

        <div>
          <label className="field-label" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {currentUser?.role === 'Admin' ? (
          <div>
            <label className="field-label" htmlFor="assignedTo">Assign User</label>
            <select id="assignedTo" name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="field-label" htmlFor="assignedTo">Assigned To</label>
            <input id="assignedTo" value={currentUser?.name || 'Loading user...'} readOnly />
          </div>
        )}

        <div>
          <label className="field-label" htmlFor="dependency">Dependency</label>
          <select id="dependency" name="dependency" value={form.dependency || 'none'} onChange={handleChange}>
            <option value="none">No Dependency</option>
            {tasks
              .filter((task) => task.id !== form.id)
              .map((task) => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
          </select>
        </div>

        <div className="form-grid-full">
          <label className="field-label" htmlFor="completedTaskLink">Completed work link (optional)</label>
          <input
            id="completedTaskLink"
            name="completedTaskLink"
            type="url"
            value={form.completedTaskLink || ''}
            onChange={handleChange}
            placeholder="https://example.com/completed-work"
          />
        </div>

        <div className="form-grid-full">
          <label className="field-label" htmlFor="taskAttachment">Upload file (optional, max 2 MB)</label>
          <input
            id="taskAttachment"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.zip,.docx,.pptx,.xlsx"
            onChange={handleAttachmentChange}
          />
          {attachmentFile ? <div className="task-meta">Selected: {attachmentFile.name}</div> : null}
          {!attachmentFile && initialValues.attachment?.name
            ? <div className="task-meta">Current attachment: {initialValues.attachment.name}</div>
            : null}
        </div>
      </div>

      {error ? <div className="form-message error">{error}</div> : null}

      <div className="form-actions">
        <button type="submit" className="primary-btn">{buttonLabel}</button>
      </div>
    </form>
  );
}
