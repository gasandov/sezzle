import { Token } from "../types";

const FUNCTION_NAMES = new Set(["sqrt", "pow"]);
const OPERATORS = new Set(["+", "-", "*", "/", "^", ","]);

export class TokenizerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenizerError";
  }
}

class Scanner {
  pos = 0;

  constructor(private readonly input: string) {}

  get eof(): boolean {
    return this.pos >= this.input.length;
  }

  peek(offset = 0): string {
    return this.input[this.pos + offset] ?? "";
  }

  advance(): string {
    return this.input[this.pos++] ?? "";
  }

  skipWhitespace(): void {
    while (!this.eof && /\s/.test(this.peek())) {
      this.advance();
    }
  }
}

function tryReadNumber(scanner: Scanner): Token | null {
  const ch = scanner.peek();
  if (!/\d/.test(ch) && !(ch === "." && /\d/.test(scanner.peek(1)))) {
    return null;
  }

  let num = "";
  let dotCount = 0;

  while (
    !scanner.eof &&
    (/\d/.test(scanner.peek()) || scanner.peek() === ".")
  ) {
    if (scanner.peek() === ".") {
      dotCount++;
      if (dotCount > 1)
        throw new TokenizerError(`Invalid number near position ${scanner.pos}`);
    }
    num += scanner.advance();
  }

  return { type: "NUMBER", value: num };
}

function tryReadFunction(scanner: Scanner): Token | null {
  if (!/[a-z]/i.test(scanner.peek())) {
    return null;
  }

  let fn = "";
  while (!scanner.eof && /[a-z]/i.test(scanner.peek())) {
    fn += scanner.advance();
  }

  if (!FUNCTION_NAMES.has(fn.toLowerCase())) {
    throw new TokenizerError(`Unknown function: "${fn}"`);
  }

  return { type: "FUNCTION", value: fn.toLowerCase() };
}

function tryReadSingleChar(scanner: Scanner, ch: string): Token | null {
  if (ch === "(") {
    scanner.advance();
    return { type: "LEFT_PAREN", value: "(" };
  }
  if (ch === ")") {
    scanner.advance();
    return { type: "RIGHT_PAREN", value: ")" };
  }
  if (ch === "%") {
    scanner.advance();
    return { type: "FUNCTION", value: "%" };
  }

  return null;
}

function tryReadOperator(scanner: Scanner, tokens: Token[]): Token[] | null {
  const ch = scanner.peek();
  if (!OPERATORS.has(ch)) {
    return null;
  }

  if ((ch === "-" || ch === "+") && isUnaryPosition(tokens)) {
    scanner.advance();
    if (ch === "-") {
      return [
        { type: "NUMBER", value: "0" },
        { type: "OPERATOR", value: "-" },
      ];
    }
    return [];
  }

  scanner.advance();
  return [{ type: "OPERATOR", value: ch }];
}

export function tokenize(equation: string): Token[] {
  const input = equation.trim();
  if (!input) throw new TokenizerError("Empty equation");

  const scanner = new Scanner(input);
  const tokens: Token[] = [];

  while (!scanner.eof) {
    scanner.skipWhitespace();
    if (scanner.eof) break;

    const ch = scanner.peek();

    const number = tryReadNumber(scanner);
    if (number) {
      tokens.push(number);
      continue;
    }

    const fn = tryReadFunction(scanner);
    if (fn) {
      tokens.push(fn);
      continue;
    }

    const single = tryReadSingleChar(scanner, ch);
    if (single) {
      tokens.push(single);
      continue;
    }

    const ops = tryReadOperator(scanner, tokens);
    if (ops) {
      tokens.push(...ops);
      continue;
    }

    throw new TokenizerError(
      `Unexpected character: "${ch}" at position ${scanner.pos}`,
    );
  }

  return tokens;
}

function isUnaryPosition(tokens: Token[]): boolean {
  if (tokens.length === 0) return true;
  const last = tokens[tokens.length - 1];
  return (
    last.type === "OPERATOR" ||
    last.type === "LEFT_PAREN" ||
    last.type === "FUNCTION"
  );
}
