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

  const calculate = useCallback(() => {
    setState((prev) => {
      const equation = prev.equation.trim();
      if (!equation) return prev;

      void (async () => {
        try {
          const { result } = await calculateEquation(equation);
          setState((current) => ({
            ...current,
            result: formatResult(result),
            status: "success",
            errorMessage: null,
          }));
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.detail
              : "Something went wrong. Please try again.";
          setState((current) => ({
            ...current,
            result: null,
            status: "error",
            errorMessage: message,
          }));
        }
      })();

      return { ...prev, status: "loading", errorMessage: null };
    });
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
