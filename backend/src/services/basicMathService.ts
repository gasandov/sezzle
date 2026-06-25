export class DivisionByZeroError extends Error {
  constructor() {
    super("Division by zero is undefined");
    this.name = "DivisionByZeroError";
  }
}

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new DivisionByZeroError();
  return a / b;
}

export function applyBasicOperator(
  operator: string,
  a: number,
  b: number,
): number {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      throw new Error(`Unknown basic operator: ${operator}`);
  }
}
