import { Task } from "../types";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implement Authentication",
    description: "Login and signup screens",
    priority: "High",
    status: "Done",
    assignedTo: "1",
    dependencies: [],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z"
  },
  {
    id: "2",
    title: "Build Dashboard",
    description: "Display statistics",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "1",
    dependencies: ["1"],
    createdAt: "2026-09-02T00:00:00.000Z",
    updatedAt: "2026-09-02T00:00:00.000Z"
  },
  {
    id: "3",
    title: "Write Documentation",
    description: "Project README and API spec",
    priority: "Low",
    status: "To Do",
    assignedTo: null,
    dependencies: [],
    createdAt: "2026-09-03T00:00:00.000Z",
    updatedAt: "2026-09-03T00:00:00.000Z"
  }
];

describe("Task Filtering Logic", () => {
  it("filters tasks by title search query", () => {
    const query = "dashboard";
    const result = mockTasks.filter((t) =>
      t.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters tasks by priority", () => {
    const resultHigh = mockTasks.filter((t) => t.priority === "High");
    expect(resultHigh).toHaveLength(1);
    expect(resultHigh[0].title).toBe("Implement Authentication");

    const resultLow = mockTasks.filter((t) => t.priority === "Low");
    expect(resultLow).toHaveLength(1);
    expect(resultLow[0].title).toBe("Write Documentation");
  });

  it("filters tasks by status", () => {
    const resultTodo = mockTasks.filter((t) => t.status === "To Do");
    expect(resultTodo).toHaveLength(1);
    expect(resultTodo[0].id).toBe("3");

    const resultDone = mockTasks.filter((t) => t.status === "Done");
    expect(resultDone).toHaveLength(1);
    expect(resultDone[0].id).toBe("1");
  });

  it("combines title search, priority and status filters", () => {
    const search = "doc";
    const priority: string = "Low";
    const status: string = "To Do";

    const result = mockTasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priority === "All" || t.priority === priority;
      const matchStatus = status === "All" || t.status === status;
      return matchSearch && matchPriority && matchStatus;
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Write Documentation");
  });
});
