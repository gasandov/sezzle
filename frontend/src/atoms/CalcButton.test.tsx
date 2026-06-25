import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CalcButton } from "./CalcButton";

describe("CalcButton", () => {
  it("renders the label", () => {
    render(
      <CalcButton label="7" value="7" variant="number" onPress={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "7" })).toBeInTheDocument();
  });

  it("calls onPress with the value when clicked", () => {
    const onPress = vi.fn();
    render(
      <CalcButton label="+" value="+" variant="operator" onPress={onPress} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledWith("+");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <CalcButton
        label="="
        value="EQUALS"
        variant="equals"
        onPress={() => {}}
        disabled
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onMouseDown when mouse is pressed", () => {
    const onMouseDown = vi.fn();
    render(
      <CalcButton
        label="C"
        value="CLEAR"
        variant="clear"
        onPress={() => {}}
        onMouseDown={onMouseDown}
      />,
    );
    fireEvent.mouseDown(screen.getByRole("button"));
    expect(onMouseDown).toHaveBeenCalled();
  });
});
