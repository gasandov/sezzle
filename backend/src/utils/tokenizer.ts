import { Token } from '../types';

const FUNCTION_NAMES = new Set(['sqrt', 'pow']);

export class TokenizerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenizerError';
  }
}

export function tokenize(equation: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const input = equation.trim();

  if (!input) throw new TokenizerError('Empty equation');

  while (i < input.length) {
    const ch = input[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Numbers (including decimals)
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(input[i + 1] ?? ''))) {
      let num = '';
      let dotCount = 0;
      while (i < input.length && (/\d/.test(input[i]) || input[i] === '.')) {
        if (input[i] === '.') {
          dotCount++;
          if (dotCount > 1) throw new TokenizerError(`Invalid number near position ${i}`);
        }
        num += input[i++];
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // Named functions (sqrt, pow)
    if (/[a-z]/i.test(ch)) {
      let fn = '';
      while (i < input.length && /[a-z]/i.test(input[i])) {
        fn += input[i++];
      }
      if (!FUNCTION_NAMES.has(fn.toLowerCase())) {
        throw new TokenizerError(`Unknown function: "${fn}"`);
      }
      tokens.push({ type: 'FUNCTION', value: fn.toLowerCase() });
      continue;
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'LEFT_PAREN', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RIGHT_PAREN', value: ')' });
      i++;
      continue;
    }

    // Percentage (unary postfix — converted to function call)
    if (ch === '%') {
      tokens.push({ type: 'FUNCTION', value: '%' });
      i++;
      continue;
    }

    // Operators: handle unary minus/plus
    if (['+', '-', '*', '/', '^', ','].includes(ch)) {
      // Detect unary minus/plus: at the start or after an operator/left-paren
      if ((ch === '-' || ch === '+') && isUnaryPosition(tokens)) {
        if (ch === '-') {
          // Represent unary minus as multiplying by -1 using a synthetic token sequence
          tokens.push({ type: 'NUMBER', value: '0' });
          tokens.push({ type: 'OPERATOR', value: '-' });
        }
        // Unary plus is a no-op
        i++;
        continue;
      }
      tokens.push({ type: 'OPERATOR', value: ch });
      i++;
      continue;
    }

    throw new TokenizerError(`Unexpected character: "${ch}" at position ${i}`);
  }

  return tokens;
}

function isUnaryPosition(tokens: Token[]): boolean {
  if (tokens.length === 0) return true;
  const last = tokens[tokens.length - 1];
  return last.type === 'OPERATOR' || last.type === 'LEFT_PAREN' || last.type === 'FUNCTION';
}
