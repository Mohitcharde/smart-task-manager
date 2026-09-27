"use client";

// --------------------------------------------------
// SMART TASK MANAGER - MY TASKS PAGE
// --------------------------------------------------

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { TaskCard } from "../../components/TaskCard";
import { EditTaskModal } from "../../components/EditTaskModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Loading } from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../context/TaskContext";
import { getMyTasks } from "../../services/api";
import { Task, TaskFormData } from "../../types";

export default function MyTasksPage() {
  const { user } = useAuth();
  const {
    tasks: allTasks,
    users,
    updateTask,
    deleteTask,
    refreshTasks
  } = useTasks();

  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchMyTasks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getMyTasks(user.id);
      if (res.tasks) {
        setMyTasks(res.tasks);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load your tasks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks, allTasks]);

  const filteredTasks = myTasks.filter((task) => {
    if (statusFilter === "All") return true;
    return task.status === statusFilter;
  });

  const handleUpdateTask = async (id: string, data: TaskFormData) => {
    await updateTask(id, data);
    setEditingTask(null);
    setFeedbackMessage("Task updated successfully!");
    await fetchMyTasks();
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
      await fetchMyTasks();
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Tasks assigned specifically to you ({user?.name})
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
              {(["All", "To Do", "In Progress", "Done"] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                      statusFilter === filter
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
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
                onClick={fetchMyTasks}
                className="font-medium underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <Loading message="Loading your tasks..." />
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-500 text-sm">
                {statusFilter === "All"
                  ? "You have no tasks assigned to you currently."
                  : `No tasks in "${statusFilter}" status.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  allTasks={allTasks}
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
