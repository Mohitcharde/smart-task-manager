// --------------------------------------------------
// SMART TASK MANAGER - API SERVICE
// --------------------------------------------------

import {
  AuthResponse,
  SingleTaskResponse,
  Task,
  TaskFormData,
  TasksResponse,
  User,
  UsersResponse
} from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Standard fetch helper that handles JSON parsing and friendly error reporting.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json"
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      // If network failure (e.g. Failed to fetch)
      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("ECONNREFUSED")
      ) {
        throw new Error("Unable to connect to the server.");
      }
      throw err;
    }
    throw new Error("An unexpected error occurred.");
  }
}

// --------------------------------------------------
// AUTH & USER APIS
// --------------------------------------------------

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function getUsers(): Promise<UsersResponse> {
  return apiRequest<UsersResponse>("/api/users", {
    method: "GET"
  });
}

// --------------------------------------------------
// TASK APIS
// --------------------------------------------------

export async function getTasks(): Promise<TasksResponse> {
  return apiRequest<TasksResponse>("/api/tasks", {
    method: "GET"
  });
}

export async function getMyTasks(userId: string): Promise<TasksResponse> {
  return apiRequest<TasksResponse>(`/api/tasks/my/${encodeURIComponent(userId)}`, {
    method: "GET"
  });
}

export async function getBlockedTasks(): Promise<TasksResponse> {
  return apiRequest<TasksResponse>("/api/tasks/blocked", {
    method: "GET"
  });
}

export async function getTaskById(taskId: string): Promise<SingleTaskResponse> {
  return apiRequest<SingleTaskResponse>(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: "GET"
  });
}

export async function createTask(
  taskData: TaskFormData
): Promise<SingleTaskResponse> {
  return apiRequest<SingleTaskResponse>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(taskData)
  });
}

export async function updateTask(
  taskId: string,
  taskData: Partial<TaskFormData>
): Promise<SingleTaskResponse> {
  return apiRequest<SingleTaskResponse>(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: "PUT",
    body: JSON.stringify(taskData)
  });
}

export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/api/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "DELETE"
    }
  );
}
