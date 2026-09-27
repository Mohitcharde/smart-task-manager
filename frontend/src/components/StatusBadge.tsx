// --------------------------------------------------
// SMART TASK MANAGER - STATUS BADGE
// --------------------------------------------------

import React from "react";
import { TaskStatus } from "../types";

interface StatusBadgeProps {
  status: TaskStatus;
  isBlocked?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isBlocked = false
}) => {
  const getStyles = () => {
    switch (status) {
      case "Done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "To Do":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        data-testid="status-badge"
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}
      >
        {status}
      </span>
      {isBlocked && status !== "Done" && (
        <span
          data-testid="blocked-badge"
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-100 text-red-800 border-red-300"
        >
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
      )}
    </div>
  );
};
