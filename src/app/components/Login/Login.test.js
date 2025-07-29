import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

describe("Login", () => {
  it("renders form fields", () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("shows error on failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, error: "Invalid credentials" })
      })
    );
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByText(/Login/i));
    expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
  });
});
