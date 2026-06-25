import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Display } from "./Display";

describe("Display", () => {
  it("renders the equation", () => {
    render(
      <Display
        equation="2+3"
        result={null}
        status="idle"
        errorMessage={null}
      />,
    );
    expect(screen.getByLabelText("Equation")).toHaveTextContent("2+3");
  });

  it("shows formatted equation — * becomes ×", () => {
    render(
      <Display
        equation="3*4"
        result={null}
        status="idle"
        errorMessage={null}
      />,
    );
    expect(screen.getByLabelText("Equation")).toHaveTextContent("3×4");
  });

  it("shows spinner when loading", () => {
    render(
      <Display
        equation="2+3"
        result={null}
        status="loading"
        errorMessage={null}
      />,
    );
    expect(screen.getByLabelText("Calculating…")).toBeInTheDocument();
  });

  it("shows result when success", () => {
    render(
      <Display
        equation="2+3"
        result="5"
        status="success"
        errorMessage={null}
      />,
    );
    expect(screen.getByLabelText("Result")).toHaveTextContent("= 5");
  });

  it("shows error message when error", () => {
    render(
      <Display
        equation="5/0"
        result={null}
        status="error"
        errorMessage="Division by zero"
      />,
    );
    expect(screen.getByLabelText("Error")).toHaveTextContent(
      "Division by zero",
    );
  });
});
