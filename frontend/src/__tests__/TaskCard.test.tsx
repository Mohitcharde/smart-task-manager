import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TaskCard } from "../components/TaskCard";
import { Task, User } from "../types";

const mockUsers: User[] = [
  { id: "1", name: "Mohit Charde", email: "mohit@example.com" }
];

const mockTask: Task = {
  id: "1",
  title: "Setup Database and Models",
  description: "Configure in-memory maps for users and tasks",
  priority: "High",
  status: "In Progress",
  assignedTo: "1",
  dependencies: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe("TaskCard Component", () => {
  it("renders task title, description, priority, status and assigned user", () => {
    render(
      <TaskCard
        task={mockTask}
        allTasks={[mockTask]}
        users={mockUsers}
      />
    );

    expect(screen.getByTestId("task-title")).toHaveTextContent(
      "Setup Database and Models"
    );
    expect(
      screen.getByText("Configure in-memory maps for users and tasks")
    ).toBeInTheDocument();
    expect(screen.getByTestId("priority-badge")).toHaveTextContent("High");
    expect(screen.getByTestId("status-badge")).toHaveTextContent("In Progress");
    expect(screen.getByTestId("assigned-user")).toHaveTextContent(
      "Mohit Charde"
    );
  });

  it("renders blocked banner if dependencies are not done", () => {
    const parentTask: Task = {
      id: "2",
      title: "Parent Task",
      description: "",
      priority: "Low",
      status: "To Do",
      assignedTo: null,
      dependencies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const dependentTask: Task = {
      id: "3",
      title: "Dependent Task",
      description: "",
      priority: "Medium",
      status: "To Do",
      assignedTo: null,
      dependencies: ["2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    render(
      <TaskCard
        task={dependentTask}
        allTasks={[parentTask, dependentTask]}
        users={mockUsers}
      />
    );

    expect(screen.getByTestId("blocked-alert")).toBeInTheDocument();
    expect(
      screen.getByText("Reason: Waiting for dependency completion.")
    ).toBeInTheDocument();
  });
});
