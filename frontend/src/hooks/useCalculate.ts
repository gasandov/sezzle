import { useState, useCallback } from "react";
import { CalcState } from "../types";
import { calculateEquation, ApiError } from "../utils/api";
import { formatResult } from "../utils/formatEquation";

const INITIAL_STATE: CalcState = {
  equation: "",
  result: null,
  status: "idle",
  errorMessage: null,
};

export function useCalculate() {
  const [state, setState] = useState<CalcState>(INITIAL_STATE);

  const appendToEquation = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      equation: prev.equation + value,
      result: null,
      status: "idle",
      errorMessage: null,
    }));
  }, []);

  const backspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      equation: prev.equation.slice(0, -1),
      status: "idle",
      errorMessage: null,
    }));
  }, []);

  const clear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const calculate = useCallback(async () => {
    setState((prev) => {
      if (!prev.equation.trim()) return prev;
      return { ...prev, status: "loading", errorMessage: null };
    });

    setState((prev) => {
      if (!prev.equation.trim()) return prev;

      // We kick off async work outside setState to avoid closure issues
      return prev;
    });

    // Read current equation via functional update
    let currentEquation = "";
    setState((prev) => {
      currentEquation = prev.equation;
      return prev;
    });

    if (!currentEquation.trim()) return;

    setState((prev) => ({ ...prev, status: "loading", errorMessage: null }));

    try {
      const { result } = await calculateEquation(currentEquation);
      setState((prev) => ({
        ...prev,
        result: formatResult(result),
        status: "success",
        errorMessage: null,
      }));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.detail
          : "Something went wrong. Please try again.";
      setState((prev) => ({
        ...prev,
        result: null,
        status: "error",
        errorMessage: message,
      }));
    }
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      switch (value) {
        case "CLEAR":
          clear();
          break;
        case "BACKSPACE":
          backspace();
          break;
        case "EQUALS":
          calculate();
          break;
        default:
          appendToEquation(value);
      }
    },
    [clear, backspace, calculate, appendToEquation],
  );

  return { state, handleInput };
}
