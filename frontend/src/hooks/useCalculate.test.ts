import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCalculate } from "./useCalculate";

vi.mock("../utils/api", () => ({
  calculateEquation: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      public detail: string,
    ) {
      super(detail);
    }
  },
}));

import { calculateEquation } from "../utils/api";

describe("useCalculate", () => {
  beforeEach(() => {
    vi.mocked(calculateEquation).mockResolvedValue({
      result: 2,
      equation: "1+1",
    });
  });

  it("calculates 1+1 when equals is pressed", async () => {
    const { result } = renderHook(() => useCalculate());

    act(() => {
      result.current.handleInput("1");
      result.current.handleInput("+");
      result.current.handleInput("1");
    });
    expect(result.current.state.equation).toBe("1+1");

    await act(async () => {
      result.current.handleInput("EQUALS");
    });

    expect(calculateEquation).toHaveBeenCalledWith("1+1");

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(calculateEquation).toHaveBeenCalledWith("1+1");
    expect(result.current.state.result).toBe("2");
  });

  it("resets to idle and clears result when typing after success", async () => {
    const { result } = renderHook(() => useCalculate());

    act(() => {
      result.current.handleInput("1");
      result.current.handleInput("+");
      result.current.handleInput("1");
    });

    await act(async () => {
      result.current.handleInput("EQUALS");
    });

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.state.result).toBe("2");

    act(() => {
      result.current.handleInput("2");
    });

    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.result).toBeNull();
    expect(result.current.state.equation).toBe("1+12");
  });
});
