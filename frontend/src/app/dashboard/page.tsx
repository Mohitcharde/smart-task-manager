"use client";

// --------------------------------------------------
// SMART TASK MANAGER - DASHBOARD PAGE
// --------------------------------------------------

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { StatsCard } from "../../components/StatsCard";
import { TaskCard } from "../../components/TaskCard";
import { TaskForm } from "../../components/TaskForm";
import { EditTaskModal } from "../../components/EditTaskModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Loading } from "../../components/Loading";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { Task, TaskFormData } from "../../types";
import { isTaskBlocked } from "../../utils/helpers";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    tasks,
    users,
    loading,
    error: contextError,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks
  } = useTasks();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Calculate Statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === "To Do").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const blockedTasks = tasks.filter((t) => isTaskBlocked(t, tasks)).length;

  // Recent Tasks: newest first, max 6
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  const handleCreateTask = async (data: TaskFormData) => {
    await createTask(data);
    setIsCreateOpen(false);
    setFeedbackMessage("Task created successfully!");
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleUpdateTask = async (id: string, data: TaskFormData) => {
    await updateTask(id, data);
    setEditingTask(null);
    setFeedbackMessage("Task updated successfully!");
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
          {/* Welcome Banner & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Here is a summary of your project progress and task dependencies.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-xs"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              + Create Task
            </button>
          </div>

          {/* Feedback message */}
          {feedbackMessage && (
            <div
              role="status"
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between shadow-xs animate-in fade-in"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">{feedbackMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Context error */}
          {contextError && (
            <div
              role="alert"
              className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between shadow-xs"
            >
              <span>{contextError}</span>
              <button
                type="button"
                onClick={() => refreshTasks()}
                className="font-medium underline hover:text-rose-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard
              title="Total Tasks"
              count={totalTasks}
              color="blue"
              icon={
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
            <StatsCard
              title="To Do"
              count={todoTasks}
              color="slate"
              icon={
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
            />
            <StatsCard
              title="In Progress"
              count={inProgressTasks}
              color="amber"
              icon={
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatsCard
              title="Completed"
              count={completedTasks}
              color="emerald"
              icon={
                <svg
                  className="w-5 h-5 text-emerald-600"
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
              }
            />
            <StatsCard
              title="Blocked"
              count={blockedTasks}
              color="red"
              icon={
                <svg
                  className="w-5 h-5 text-red-600"
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
              }
            />
          </div>

          {/* Recent Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
                <p className="text-xs text-slate-500">
                  Latest tasks created in your organization
                </p>
              </div>
              {tasks.length > 6 && (
                <Link
                  href="/tasks"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  View all ({tasks.length}) →
                </Link>
              )}
            </div>

            {loading && tasks.length === 0 ? (
              <Loading message="Loading dashboard tasks..." />
            ) : recentTasks.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">
                  No tasks created yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Get started by creating your first task and assigning dependencies.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  + Create First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    allTasks={tasks}
                    users={users}
                    onEdit={(t) => setEditingTask(t)}
                    onDelete={(t) => {
                      setDeleteError(null);
                      setDeletingTask(t);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Create Task Modal */}
        {isCreateOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Create New Task
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add a new task with assignees, priority, and dependencies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
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
                onSubmit={handleCreateTask}
                onCancel={() => setIsCreateOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
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
              : `Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`
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
