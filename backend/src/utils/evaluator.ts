import { Token } from '../types';
import { applyBasicOperator, DivisionByZeroError } from '../services/basicMathService';
import { applyAdvFunction } from '../services/advMathService';

export class EvaluationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvaluationError';
  }
}

const BASIC_OPS = new Set(['+', '-', '*', '/']);

/**
 * Evaluates an RPN token list produced by shuntingYard().
 * Delegates to basicMathService or advMathService based on the token.
 */
export function evaluateRPN(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const n = parseFloat(token.value);
      if (isNaN(n)) throw new EvaluationError(`Invalid number token: "${token.value}"`);
      stack.push(n);
      continue;
    }

    if (token.type === 'OPERATOR') {
      if (stack.length < 2) {
        throw new EvaluationError(`Insufficient operands for operator "${token.value}"`);
      }
      const b = stack.pop()!;
      const a = stack.pop()!;

      if (BASIC_OPS.has(token.value)) {
        try {
          stack.push(applyBasicOperator(token.value, a, b));
        } catch (e) {
          if (e instanceof DivisionByZeroError) throw e;
          throw new EvaluationError((e as Error).message);
        }
      } else if (token.value === '^') {
        stack.push(applyAdvFunction('pow', [a, b]));
      } else {
        throw new EvaluationError(`Unknown operator: "${token.value}"`);
      }
      continue;
    }

    if (token.type === 'FUNCTION') {
      // Functions are encoded as "name:arity" after shunting-yard processing
      const colonIdx = token.value.indexOf(':');
      if (colonIdx === -1) {
        throw new EvaluationError(`Malformed function token: "${token.value}"`);
      }
      const fnName = token.value.slice(0, colonIdx);
      const arity = parseInt(token.value.slice(colonIdx + 1), 10);

      if (stack.length < arity) {
        throw new EvaluationError(`Insufficient arguments for function "${fnName}"`);
      }
      const args = stack.splice(stack.length - arity, arity);
      stack.push(applyAdvFunction(fnName, args));
      continue;
    }
  }

  if (stack.length !== 1) {
    throw new EvaluationError('Invalid equation: too many operands');
  }

  const result = stack[0];

  // Round float precision anomalies (e.g. 0.1 + 0.2 = 0.30000000000000004)
  return parseFloat(result.toPrecision(12));
}
