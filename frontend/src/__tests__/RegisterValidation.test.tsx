import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/register/page";
import * as AuthContextModule from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn()
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

describe("RegisterPage Validation", () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      user: null,
      loading: false
    });
  });

  it("shows error when passwords do not match", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Mohit Charde" }
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "mohit@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: "password123" }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "mismatch456" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Passwords do not match"
      );
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it("submits registration when all fields are valid and match", async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Mohit Charde" }
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "mohit@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: "password123" }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "Mohit Charde",
        "mohit@example.com",
        "password123"
      );
    });
  });
});
