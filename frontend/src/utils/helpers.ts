// --------------------------------------------------
// SMART TASK MANAGER - HELPER UTILITIES
// --------------------------------------------------

import { Task, User } from "../types";

/**
 * Checks whether a given task is currently blocked by incomplete dependencies.
 * A task is considered blocked if:
 * 1. Its status is NOT "Done"
 * 2. It has one or more dependencies
 * 3. At least one of its dependency tasks is not "Done" (or missing)
 */
export const isTaskBlocked = (task: Task, allTasks: Task[]): boolean => {
  if (task.status === "Done") {
    return false;
  }

  if (!task.dependencies || task.dependencies.length === 0) {
    return false;
  }

  const taskMap = new Map<string, Task>();
  for (const t of allTasks) {
    taskMap.set(String(t.id), t);
  }

  return task.dependencies.some((depId) => {
    const depTask = taskMap.get(String(depId));
    return !depTask || depTask.status !== "Done";
  });
};

/**
 * Returns the list of incomplete dependency tasks that are blocking the given task.
 */
export const getPendingDependencies = (
  task: Task,
  allTasks: Task[]
): { id: string; title: string; status: string }[] => {
  if (!task.dependencies || task.dependencies.length === 0) {
    return [];
  }

  const taskMap = new Map<string, Task>();
  for (const t of allTasks) {
    taskMap.set(String(t.id), t);
  }

  const pending: { id: string; title: string; status: string }[] = [];

  for (const depId of task.dependencies) {
    const depTask = taskMap.get(String(depId));
    if (!depTask) {
      pending.push({
        id: String(depId),
        title: `Task #${depId} (Not Found)`,
        status: "Unknown"
      });
    } else if (depTask.status !== "Done") {
      pending.push({
        id: depTask.id,
        title: depTask.title,
        status: depTask.status
      });
    }
  }

  return pending;
};

/**
 * Formats a user ID into their display name.
 */
export const getUserName = (userId: string | null, users: User[]): string => {
  if (!userId) return "Unassigned";
  const user = users.find((u) => String(u.id) === String(userId));
  return user ? user.name : `User #${userId}`;
};

/**
 * Formats an ISO date string into a readable format.
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
};
