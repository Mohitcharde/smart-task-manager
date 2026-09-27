import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../app/login/page";
import * as AuthContextModule from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn()
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

describe("LoginPage Component", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false
    });
  });

  it("renders email and password inputs and sign in button", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in/i })
    ).toBeInTheDocument();
  });

  it("calls login with entered email and password", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "secret123" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "secret123");
    });
  });
});
