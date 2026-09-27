import { Task } from "../types";
import { isTaskBlocked } from "../utils/helpers";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Task 1",
    description: "",
    priority: "High",
    status: "To Do",
    assignedTo: null,
    dependencies: [],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z"
  },
  {
    id: "2",
    title: "Task 2",
    description: "",
    priority: "Medium",
    status: "In Progress",
    assignedTo: null,
    dependencies: [],
    createdAt: "2026-09-02T00:00:00.000Z",
    updatedAt: "2026-09-02T00:00:00.000Z"
  },
  {
    id: "3",
    title: "Task 3",
    description: "",
    priority: "Low",
    status: "Done",
    assignedTo: null,
    dependencies: [],
    createdAt: "2026-09-03T00:00:00.000Z",
    updatedAt: "2026-09-03T00:00:00.000Z"
  },
  {
    id: "4",
    title: "Task 4 (Blocked by Task 1)",
    description: "",
    priority: "High",
    status: "To Do",
    assignedTo: null,
    dependencies: ["1"],
    createdAt: "2026-09-04T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z"
  }
];

describe("Dashboard Statistics Calculation", () => {
  it("computes Total, To Do, In Progress, Completed, and Blocked task counts correctly", () => {
    const totalTasks = mockTasks.length;
    const todoTasks = mockTasks.filter((t) => t.status === "To Do").length;
    const inProgressTasks = mockTasks.filter((t) => t.status === "In Progress").length;
    const completedTasks = mockTasks.filter((t) => t.status === "Done").length;
    const blockedTasks = mockTasks.filter((t) => isTaskBlocked(t, mockTasks)).length;

    expect(totalTasks).toBe(4);
    expect(todoTasks).toBe(2);
    expect(inProgressTasks).toBe(1);
    expect(completedTasks).toBe(1);
    expect(blockedTasks).toBe(1);
  });

  it("updates blocked count dynamically when dependency becomes Done", () => {
    // Make Task 1 "Done"
    const updatedTasks: Task[] = mockTasks.map((t) =>
      t.id === "1" ? { ...t, status: "Done" as const } : t
    );

    const blockedTasks = updatedTasks.filter((t) => isTaskBlocked(t, updatedTasks)).length;
    expect(blockedTasks).toBe(0);
  });
});
