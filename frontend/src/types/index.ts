// --------------------------------------------------
// SMART TASK MANAGER - TYPE DEFINITIONS
// --------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
}

export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string | null;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string | null;
  dependencies: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  [key: string]: unknown;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  tasks: Task[];
}

export interface SingleTaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  users: User[];
}
