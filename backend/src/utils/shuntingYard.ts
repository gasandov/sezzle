import { Token, OperatorMeta } from "../types";

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

const OPERATORS: Record<string, OperatorMeta> = {
  "+": { precedence: 1, associativity: "left", arity: 2 },
  "-": { precedence: 1, associativity: "left", arity: 2 },
  "*": { precedence: 2, associativity: "left", arity: 2 },
  "/": { precedence: 2, associativity: "left", arity: 2 },
  "^": { precedence: 3, associativity: "right", arity: 2 },
};

class ShuntingYardState {
  readonly output: Token[] = [];
  private readonly operatorStack: Token[] = [];
  private readonly arityStack: number[] = [];

  peekOperator(): Token | undefined {
    return this.operatorStack[this.operatorStack.length - 1];
  }

  popOperator(): Token {
    return this.operatorStack.pop()!;
  }

  pushOperator(token: Token): void {
    this.operatorStack.push(token);
  }

  hasOperators(): boolean {
    return this.operatorStack.length > 0;
  }

  incrementArity(): void {
    if (this.arityStack.length > 0) {
      this.arityStack[this.arityStack.length - 1]++;
    }
  }

  popArity(): number {
    return this.arityStack.pop()!;
  }

  pushArity(value: number): void {
    this.arityStack.push(value);
  }
}

function shouldPopStackTop(stackTop: Token, incoming: OperatorMeta): boolean {
  if (stackTop.type === "LEFT_PAREN") return false;
  if (stackTop.type === "FUNCTION") return true;

  const topOp = OPERATORS[stackTop.value];
  if (!topOp) return false;

  return (
    topOp.precedence > incoming.precedence ||
    (topOp.precedence === incoming.precedence &&
      incoming.associativity === "left")
  );
}

function drainOperatorsUntilLeftParen(state: ShuntingYardState): void {
  while (state.hasOperators() && state.peekOperator()!.type !== "LEFT_PAREN") {
    state.output.push(state.popOperator());
  }
}

function emitFunction(
  state: ShuntingYardState,
  fn: Token,
  arity: number,
): void {
  state.output.push({ ...fn, value: `${fn.value}:${arity}` });
}

function handleComma(state: ShuntingYardState): void {
  drainOperatorsUntilLeftParen(state);
  if (!state.hasOperators()) {
    throw new ParseError("Mismatched parentheses or misplaced comma");
  }
  state.incrementArity();
}

function handleNumber(state: ShuntingYardState, token: Token): void {
  state.output.push(token);
}

function handleFunction(state: ShuntingYardState, token: Token): void {
  if (token.value === "%") {
    emitFunction(state, token, 1);
    return;
  }
  state.pushOperator(token);
  state.pushArity(0);
}

function handleOperator(state: ShuntingYardState, token: Token): void {
  const op = OPERATORS[token.value];
  if (!op) throw new ParseError(`Unknown operator: "${token.value}"`);

  while (state.hasOperators()) {
    const top = state.peekOperator()!;
    if (top.type === "LEFT_PAREN") break;
    if (!shouldPopStackTop(top, op)) break;

    state.output.push(state.popOperator());
    if (top.type === "FUNCTION") {
      state.popArity();
    }
  }
  state.pushOperator(token);
}

function handleLeftParen(state: ShuntingYardState, token: Token): void {
  state.pushOperator(token);
}

function handleRightParen(state: ShuntingYardState): void {
  let foundLeft = false;
  while (state.hasOperators()) {
    const top = state.peekOperator()!;
    if (top.type === "LEFT_PAREN") {
      foundLeft = true;
      state.popOperator();
      break;
    }
    state.output.push(state.popOperator());
  }
  if (!foundLeft) {
    throw new ParseError('Mismatched parentheses: missing "("');
  }

  if (state.peekOperator()?.type === "FUNCTION") {
    const fn = state.popOperator();
    const arity = state.popArity() + 1;
    emitFunction(state, fn, arity);
  }
}

function finalize(state: ShuntingYardState): void {
  while (state.hasOperators()) {
    const top = state.popOperator();
    if (top.type === "LEFT_PAREN" || top.type === "RIGHT_PAREN") {
      throw new ParseError("Mismatched parentheses");
    }
    state.output.push(top);
  }
}

/**
 * Converts an infix token list to Reverse Polish Notation (RPN) using
 * the Shunting-Yard Algorithm (Dijkstra, 1961).
 */
export function shuntingYard(tokens: Token[]): Token[] {
  const state = new ShuntingYardState();

  for (const token of tokens) {
    if (token.type === "OPERATOR" && token.value === ",") {
      handleComma(state);
      continue;
    }

    switch (token.type) {
      case "NUMBER":
        handleNumber(state, token);
        break;
      case "FUNCTION":
        handleFunction(state, token);
        break;
      case "OPERATOR":
        handleOperator(state, token);
        break;
      case "LEFT_PAREN":
        handleLeftParen(state, token);
        break;
      case "RIGHT_PAREN":
        handleRightParen(state);
        break;
    }
  }

  finalize(state);
  return state.output;
}
