"use client";

// --------------------------------------------------
// SMART TASK MANAGER - TASK FORM
// --------------------------------------------------

import React, { useState } from "react";
import { TaskFormData, TaskPriority, TaskStatus } from "../types";
import { useTasks } from "../context/TaskContext";

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  taskId?: string;
  submitLabel?: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  taskId,
  submitLabel = "Create Task",
  onSubmit,
  onCancel
}) => {
  const { users, tasks } = useTasks();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || "Medium"
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status || "To Do"
  );
  const [assignedTo, setAssignedTo] = useState<string>(
    initialData?.assignedTo || ""
  );
  const [dependencies, setDependencies] = useState<string[]>(
    initialData?.dependencies || []
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Available tasks to depend on (exclude the current task if editing)
  const availableDependencyTasks = tasks.filter(
    (t) => !taskId || String(t.id) !== String(taskId)
  );

  const handleDependencyToggle = (depTaskId: string) => {
    setDependencies((prev) =>
      prev.includes(depTaskId)
        ? prev.filter((id) => id !== depTaskId)
        : [...prev, depTaskId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assignedTo: assignedTo ? assignedTo : null,
        dependencies
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save task";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg flex items-center gap-2"
        >
          <svg
            className="w-4 h-4 shrink-0 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Task Title */}
      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement user authentication"
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Task Description */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="task-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details, requirements or acceptance criteria..."
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Grid: Priority, Status, Assigned User */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Priority */}
        <div>
          <label
            htmlFor="task-priority"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="task-status"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Assigned User */}
        <div>
          <label
            htmlFor="task-assigned"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Assign User
          </label>
          <select
            id="task-assigned"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Dependencies */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Dependencies
          <span className="text-xs font-normal text-slate-500 ml-2">
            (This task cannot be marked Done until all selected tasks are completed)
          </span>
        </label>
        {availableDependencyTasks.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-2 border border-dashed border-slate-200 rounded-lg">
            No other tasks available yet to set as dependency.
          </p>
        ) : (
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2.5 space-y-1.5 bg-slate-50">
            {availableDependencyTasks.map((depTask) => (
              <label
                key={depTask.id}
                className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer text-xs transition"
              >
                <input
                  type="checkbox"
                  checked={dependencies.includes(String(depTask.id))}
                  onChange={() => handleDependencyToggle(String(depTask.id))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-mono text-slate-400">#{depTask.id}</span>
                <span className="font-medium text-slate-800 flex-1 truncate">
                  {depTask.title}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    depTask.status === "Done"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {depTask.status}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
