"use client";

// --------------------------------------------------
// SMART TASK MANAGER - TASK CONTEXT
// --------------------------------------------------

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Task, TaskFormData, User } from "../types";
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  getTasks as apiGetTasks,
  getUsers as apiGetUsers,
  updateTask as apiUpdateTask
} from "../services/api";

interface TaskContextType {
  tasks: Task[];
  users: User[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createTask: (data: TaskFormData) => Promise<Task>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGetTasks();
      if (res.tasks) {
        setTasks(res.tasks);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load tasks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiGetUsers();
      if (res.users) {
        setUsers(res.users);
      }
    } catch (err: unknown) {
      console.error("Failed to load users:", err);
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const createTask = async (data: TaskFormData): Promise<Task> => {
    const res = await apiCreateTask(data);
    if (res.task) {
      setTasks((prev) => [...prev, res.task]);
      return res.task;
    }
    throw new Error(res.message || "Failed to create task");
  };

  const updateTask = async (
    id: string,
    data: Partial<TaskFormData>
  ): Promise<Task> => {
    const res = await apiUpdateTask(id, data);
    if (res.task) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? res.task : t))
      );
      return res.task;
    }
    throw new Error(res.message || "Failed to update task");
  };

  const deleteTask = async (id: string): Promise<void> => {
    const res = await apiDeleteTask(id);
    if (res.success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      throw new Error(res.message || "Failed to delete task");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        users,
        loading,
        error,
        fetchTasks,
        fetchUsers,
        createTask,
        updateTask,
        deleteTask,
        refreshTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
