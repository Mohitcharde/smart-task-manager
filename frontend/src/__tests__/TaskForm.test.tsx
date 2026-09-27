import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "../components/TaskForm";
import * as TaskContextModule from "../context/TaskContext";

jest.mock("../context/TaskContext", () => ({
  useTasks: jest.fn()
}));

describe("TaskForm Component", () => {
  beforeEach(() => {
    (TaskContextModule.useTasks as jest.Mock).mockReturnValue({
      users: [
        { id: "1", name: "Mohit Charde", email: "mohit@example.com" }
      ],
      tasks: [
        {
          id: "10",
          title: "Existing Task",
          status: "Done",
          priority: "Low",
          dependencies: []
        }
      ]
    });
  });

  it("renders form fields correctly", () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assign User/i)).toBeInTheDocument();
  });

  it("submits the form with provided data when valid", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: "New Important Task" }
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Task details" }
    });
    fireEvent.change(screen.getByLabelText(/Priority/i), {
      target: { value: "High" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Task/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Important Task",
          description: "Task details",
          priority: "High"
        })
      );
    });
  });
});
