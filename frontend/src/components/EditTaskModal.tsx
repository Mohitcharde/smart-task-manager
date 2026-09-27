"use client";

// --------------------------------------------------
// SMART TASK MANAGER - EDIT TASK MODAL
// --------------------------------------------------

import React from "react";
import { Task, TaskFormData } from "../types";
import { TaskForm } from "./TaskForm";

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: TaskFormData) => Promise<void>;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !task) return null;

  const handleSubmit = async (data: TaskFormData) => {
    await onSave(task.id, data);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Edit Task #{task.id}
            </h3>
            <p className="text-xs text-slate-500">
              Update task details, assignees, or dependencies.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <TaskForm
          initialData={{
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            assignedTo: task.assignedTo || "",
            dependencies: task.dependencies
          }}
          taskId={task.id}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
