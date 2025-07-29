import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeRegistration from "./EmployeeRegistration";

describe("EmployeeRegistration", () => {
  it("renders form fields", () => {
    render(<EmployeeRegistration />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
  });

  it("submits the form", () => {
    render(<EmployeeRegistration />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: "HR" } });
    fireEvent.click(screen.getByText(/Register/i));
    expect(window.alert).toBeCalledWith("Registered: John");
  });
});
