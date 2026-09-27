// --------------------------------------------------
// SMART TASK MANAGER - TASK CARD
// --------------------------------------------------

import React from "react";
import { Task, User } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import {
  formatDate,
  getPendingDependencies,
  getUserName,
  isTaskBlocked
} from "../utils/helpers";

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  users: User[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  allTasks,
  users,
  onEdit,
  onDelete
}) => {
  const blocked = isTaskBlocked(task, allTasks);
  const pendingDeps = getPendingDependencies(task, allTasks);
  const assignedName = getUserName(task.assignedTo, users);

  // Map dependency IDs to their task titles
  const dependencyDetails = task.dependencies.map((depId) => {
    const depTask = allTasks.find((t) => String(t.id) === String(depId));
    return {
      id: depId,
      title: depTask ? depTask.title : `Task #${depId}`,
      isDone: depTask ? depTask.status === "Done" : false
    };
  });

  return (
    <div
      data-testid="task-card"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition duration-150 flex flex-col justify-between"
    >
      <div>
        {/* Header: Title and Badges */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-slate-400">
                #{task.id}
              </span>
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} isBlocked={blocked} />
            </div>
            <h3
              data-testid="task-title"
              className="text-base font-semibold text-slate-900 leading-snug"
            >
              {task.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {task.description ? (
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">No description provided.</p>
        )}

        {/* Blocked Alert Banner */}
        {blocked && (
          <div
            data-testid="blocked-alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800"
          >
            <div className="flex items-center gap-1.5 font-semibold text-red-900 mb-1">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>BLOCKED</span>
            </div>
            <p className="text-red-700">Reason: Waiting for dependency completion.</p>
            {pendingDeps.length > 0 && (
              <div className="mt-1.5 pt-1.5 border-t border-red-200 text-red-700">
                <span className="font-medium">Pending:</span>{" "}
                {pendingDeps.map((d) => d.title).join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Meta: Assigned User and Dependencies */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Assigned To:</span>
            <span
              data-testid="assigned-user"
              className="font-medium text-slate-800 flex items-center gap-1"
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                {assignedName.charAt(0).toUpperCase()}
              </span>
              {assignedName}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-400">Dependencies:</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
              {dependencyDetails.length > 0 ? (
                dependencyDetails.map((dep) => (
                  <span
                    key={dep.id}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                      dep.isDone
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                    title={dep.isDone ? "Completed" : "Pending"}
                  >
                    #{dep.id} {dep.title} {dep.isDone ? "✓" : "⏳"}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400">
          {formatDate(task.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="px-3 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
