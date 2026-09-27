"use client";

// --------------------------------------------------
// SMART TASK MANAGER - BLOCKED TASKS PAGE
// --------------------------------------------------

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { PriorityBadge } from "../../components/PriorityBadge";
import { StatusBadge } from "../../components/StatusBadge";
import { Loading } from "../../components/Loading";
import { EditTaskModal } from "../../components/EditTaskModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useTasks } from "../../context/TaskContext";
import { getBlockedTasks } from "../../services/api";
import { Task, TaskFormData } from "../../types";
import {
  formatDate,
  getPendingDependencies,
  getUserName
} from "../../utils/helpers";

export default function BlockedTasksPage() {
  const {
    tasks: allTasks,
    users,
    updateTask,
    deleteTask,
    refreshTasks
  } = useTasks();

  const [blockedTasks, setBlockedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchBlockedTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBlockedTasks();
      if (res.tasks) {
        setBlockedTasks(res.tasks);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load blocked tasks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockedTasks();
  }, [fetchBlockedTasks, allTasks]);

  const handleUpdateTask = async (id: string, data: TaskFormData) => {
    await updateTask(id, data);
    setEditingTask(null);
    setFeedbackMessage("Task updated successfully!");
    await fetchBlockedTasks();
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    try {
      setActionLoading(true);
      setDeleteError(null);
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      setFeedbackMessage("Task deleted successfully!");
      await fetchBlockedTasks();
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete task";
      setDeleteError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                Blocked Tasks
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                {blockedTasks.length} Blocked
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              These tasks cannot be completed until their dependency tasks are marked as Done.
            </p>
          </div>

          {/* Feedback */}
          {feedbackMessage && (
            <div
              role="status"
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between"
            >
              <span>{feedbackMessage}</span>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchBlockedTasks}
                className="font-medium underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <Loading message="Loading blocked tasks..." />
          ) : blockedTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-emerald-300 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                No blocked tasks!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                All task dependencies are satisfied or no active dependencies are blocking execution.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedTasks.map((task) => {
                const pendingDeps = getPendingDependencies(task, allTasks);
                const assignedName = getUserName(task.assignedTo, users);

                return (
                  <div
                    key={task.id}
                    data-testid="blocked-task-card"
                    className="bg-white rounded-xl border border-red-200 p-5 shadow-xs hover:border-red-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-medium text-slate-400">
                            #{task.id}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                            <svg
                              className="w-3 h-3 mr-1 text-red-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            BLOCKED
                          </span>
                          <PriorityBadge priority={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-sm text-slate-600">
                            {task.description}
                          </p>
                        )}

                        {/* Blocked Reason Card */}
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 space-y-1">
                          <p className="font-semibold flex items-center gap-1.5">
                            Reason: Waiting for dependency completion.
                          </p>
                          <div className="text-red-700">
                            <span className="font-medium">Unresolved dependencies:</span>{" "}
                            {pendingDeps.length > 0 ? (
                              pendingDeps.map((d) => (
                                <span
                                  key={d.id}
                                  className="inline-block bg-white px-2 py-0.5 rounded border border-red-200 text-red-800 font-mono text-[11px] mr-1.5 my-0.5"
                                >
                                  #{d.id} {d.title} ({d.status})
                                </span>
                              ))
                            ) : (
                              <span>Pending dependency checks</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <span>
                            Assigned to: <strong className="text-slate-700">{assignedName}</strong>
                          </span>
                          <span>•</span>
                          <span>Created: {formatDate(task.createdAt)}</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex md:flex-col items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingTask(task)}
                          className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                        >
                          Edit Task
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeletingTask(task);
                          }}
                          className="w-full px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                        >
                          Delete Task
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Edit Modal */}
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deletingTask}
          title="Delete Task"
          message={
            deleteError
              ? deleteError
              : `Are you sure you want to delete "${deletingTask?.title}"?`
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDangerous={true}
          isLoading={actionLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setDeletingTask(null);
            setDeleteError(null);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
