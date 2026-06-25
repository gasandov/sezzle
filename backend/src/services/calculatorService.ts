import { tokenize, TokenizerError } from "../utils/tokenizer";
import { shuntingYard, ParseError } from "../utils/shuntingYard";
import { evaluateRPN, EvaluationError } from "../utils/evaluator";
import { DivisionByZeroError } from "./basicMathService";
import logger from "../utils/logger";

export type CalculationSuccess = { result: number };
export type CalculationFailure = { error: string; detail: string };
export type CalculationOutcome = CalculationSuccess | CalculationFailure;

export function isFailure(
  outcome: CalculationOutcome,
): outcome is CalculationFailure {
  return "error" in outcome;
}

const VALID_EQUATION_RE = /^[0-9+\-*/^().,%\s a-z]+$/i;

export function calculate(equation: string): CalculationOutcome {
  const trimmed = equation.trim();

  if (!trimmed) {
    return {
      error: "Empty equation",
      detail: "The equation field must not be empty",
    };
  }

  if (!VALID_EQUATION_RE.test(trimmed)) {
    return {
      error: "Invalid characters in equation",
      detail: `Equation contains unsupported characters: "${trimmed}"`,
    };
  }

  try {
    logger.debug({ equation: trimmed }, "Tokenizing equation");
    const tokens = tokenize(trimmed);

    logger.debug({ tokens }, "Running Shunting-Yard");
    const rpn = shuntingYard(tokens);

    logger.debug({ rpn }, "Evaluating RPN");
    const result = evaluateRPN(rpn);

    if (!isFinite(result)) {
      return {
        error: "Result is not finite",
        detail: "The equation produced Infinity or NaN",
      };
    }

    logger.info({ equation: trimmed, result }, "Calculation complete");
    return { result };
  } catch (e) {
    if (e instanceof DivisionByZeroError) {
      return { error: "Division by zero", detail: e.message };
    }
    if (
      e instanceof TokenizerError ||
      e instanceof ParseError ||
      e instanceof EvaluationError
    ) {
      return { error: "Unparseable equation", detail: e.message };
    }
    logger.error({ err: e }, "Unexpected error during calculation");
    return { error: "Internal error", detail: "An unexpected error occurred" };
  }
}
