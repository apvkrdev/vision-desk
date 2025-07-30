import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

test("renders dashboard title", () => {
  render(<Dashboard />);
  expect(screen.getByText(/Welcome to the Dashboard/i)).toBeInTheDocument();
});

test("renders employee details card", () => {
  render(<Dashboard />);
  expect(screen.getByText(/Employee Details/i)).toBeInTheDocument();
});
