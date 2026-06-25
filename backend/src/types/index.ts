export type TokenType =
  | 'NUMBER'
  | 'OPERATOR'
  | 'LEFT_PAREN'
  | 'RIGHT_PAREN'
  | 'FUNCTION';

export interface Token {
  type: TokenType;
  value: string;
}

export interface OperatorMeta {
  precedence: number;
  associativity: 'left' | 'right';
  arity: number;
}

export interface CalculateRequest {
  equation: string;
}

export interface CalculateResponse {
  result: number;
  equation: string;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
}
