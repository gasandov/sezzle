export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function squareRoot(value: number): number {
  if (value < 0) throw new Error('Square root of a negative number is not real');
  return Math.sqrt(value);
}

export function percentage(value: number): number {
  return value / 100;
}

export function applyAdvFunction(fn: string, args: number[]): number {
  switch (fn) {
    case 'pow':
      if (args.length !== 2) throw new Error('pow requires 2 arguments');
      return power(args[0], args[1]);
    case 'sqrt':
      if (args.length !== 1) throw new Error('sqrt requires 1 argument');
      return squareRoot(args[0]);
    case '%':
      if (args.length !== 1) throw new Error('% requires 1 argument');
      return percentage(args[0]);
    default:
      throw new Error(`Unknown advanced function: ${fn}`);
  }
}
