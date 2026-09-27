import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PriorityBadge } from "../components/PriorityBadge";
import { StatusBadge } from "../components/StatusBadge";

describe("Badges Components", () => {
  describe("PriorityBadge", () => {
    it("renders Low priority badge", () => {
      render(<PriorityBadge priority="Low" />);
      const badge = screen.getByTestId("priority-badge");
      expect(badge).toHaveTextContent("Low");
      expect(badge).toHaveClass("text-emerald-700");
    });

    it("renders Medium priority badge", () => {
      render(<PriorityBadge priority="Medium" />);
      const badge = screen.getByTestId("priority-badge");
      expect(badge).toHaveTextContent("Medium");
      expect(badge).toHaveClass("text-amber-700");
    });

    it("renders High priority badge", () => {
      render(<PriorityBadge priority="High" />);
      const badge = screen.getByTestId("priority-badge");
      expect(badge).toHaveTextContent("High");
      expect(badge).toHaveClass("text-rose-700");
    });
  });

  describe("StatusBadge", () => {
    it("renders To Do status badge", () => {
      render(<StatusBadge status="To Do" />);
      const badge = screen.getByTestId("status-badge");
      expect(badge).toHaveTextContent("To Do");
    });

    it("renders In Progress status badge", () => {
      render(<StatusBadge status="In Progress" />);
      const badge = screen.getByTestId("status-badge");
      expect(badge).toHaveTextContent("In Progress");
    });

    it("renders Done status badge without blocked badge", () => {
      render(<StatusBadge status="Done" isBlocked={true} />);
      const badge = screen.getByTestId("status-badge");
      expect(badge).toHaveTextContent("Done");
      expect(screen.queryByTestId("blocked-badge")).not.toBeInTheDocument();
    });

    it("renders BLOCKED badge when status is not Done and isBlocked is true", () => {
      render(<StatusBadge status="To Do" isBlocked={true} />);
      const blockedBadge = screen.getByTestId("blocked-badge");
      expect(blockedBadge).toHaveTextContent("BLOCKED");
    });
  });
});
