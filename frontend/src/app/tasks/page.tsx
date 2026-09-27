"use client";

// --------------------------------------------------
// SMART TASK MANAGER - ALL TASKS PAGE
// --------------------------------------------------

import React, { useState } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { TaskCard } from "../../components/TaskCard";
import { TaskForm } from "../../components/TaskForm";
import { EditTaskModal } from "../../components/EditTaskModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Loading } from "../../components/Loading";
import { useTasks } from "../../context/TaskContext";
import { Task, TaskFormData, TaskPriority, TaskStatus } from "../../types";

export default function AllTasksPage() {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">All Tasks</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Browse, search, filter, and manage tasks across your team.
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

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              role="status"
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between shadow-xs animate-in fade-in"
            >
              <span className="font-medium">{feedbackMessage}</span>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error Message */}
          {contextError && (
            <div
              role="alert"
              className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between"
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

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search-tasks"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1"
              >
                Search by Title
              </label>
              <div className="relative">
                <input
                  id="search-tasks"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label
                htmlFor="filter-priority"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1"
              >
                Priority
              </label>
              <select
                id="filter-priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="filter-status"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1"
              >
                Status
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Task Grid */}
          {loading && tasks.length === 0 ? (
            <Loading message="Loading tasks..." />
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-500 text-sm">
                No tasks match your criteria.
              </p>
              {(searchQuery ||
                priorityFilter !== "All" ||
                statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPriorityFilter("All");
                    setStatusFilter("All");
                  }}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
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
                <h3 className="text-lg font-semibold text-slate-900">
                  Create New Task
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
                >
                  ✕
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
