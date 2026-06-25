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

/**
 * Converts an infix token list to Reverse Polish Notation (RPN) using
 * the Shunting-Yard Algorithm (Dijkstra, 1961).
 */
export function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operatorStack: Token[] = [];
  const arityStack: number[] = []; // tracks argument count for functions

  for (const token of tokens) {
    // Comma: function argument separator — drain until left paren
    if (token.type === "OPERATOR" && token.value === ",") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== "LEFT_PAREN"
      ) {
        output.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new ParseError("Mismatched parentheses or misplaced comma");
      }
      if (arityStack.length > 0) {
        arityStack[arityStack.length - 1]++;
      }
      continue;
    }

    switch (token.type) {
      case "NUMBER":
        output.push(token);
        break;

      case "FUNCTION":
        // % is postfix unary — push directly to output; no paren wrapping
        if (token.value === "%") {
          output.push({ type: "FUNCTION", value: "%:1" });
          break;
        }
        operatorStack.push(token);
        arityStack.push(0);
        break;

      case "OPERATOR": {
        const op = OPERATORS[token.value];
        if (!op) throw new ParseError(`Unknown operator: "${token.value}"`);

        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.type === "LEFT_PAREN") break;

          if (top.type === "OPERATOR") {
            const topOp = OPERATORS[top.value];
            if (
              topOp &&
              (topOp.precedence > op.precedence ||
                (topOp.precedence === op.precedence &&
                  op.associativity === "left"))
            ) {
              output.push(operatorStack.pop()!);
            } else {
              break;
            }
          } else {
            // top is a function
            output.push(operatorStack.pop()!);
            arityStack.pop();
          }
        }
        operatorStack.push(token);
        break;
      }

      case "LEFT_PAREN":
        operatorStack.push(token);
        break;

      case "RIGHT_PAREN": {
        let foundLeft = false;
        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.type === "LEFT_PAREN") {
            foundLeft = true;
            operatorStack.pop();
            break;
          }
          output.push(operatorStack.pop()!);
        }
        if (!foundLeft)
          throw new ParseError('Mismatched parentheses: missing "("');

        // If the top is a function, pop it too (handles sqrt(...), pow(...))
        if (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type === "FUNCTION"
        ) {
          const fn = operatorStack.pop()!;
          const arity = arityStack.pop()! + 1; // +1 for the last arg
          output.push({ ...fn, value: `${fn.value}:${arity}` });
        }
        break;
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === "LEFT_PAREN" || top.type === "RIGHT_PAREN") {
      throw new ParseError("Mismatched parentheses");
    }
    output.push(top);
  }

  return output;
}
