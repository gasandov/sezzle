export type CalcStatus = "idle" | "loading" | "success" | "error";

export interface CalcState {
  equation: string;
  result: string | null;
  status: CalcStatus;
  errorMessage: string | null;
}

export interface CalculateApiResponse {
  result: number;
  equation: string;
}

export interface ApiErrorResponse {
  error: string;
  detail?: string;
}

export type ButtonVariant =
  | "number"
  | "operator"
  | "equals"
  | "function"
  | "clear";

export interface CalcButtonDef {
  label: string;
  value: string;
  variant: ButtonVariant;
  wide?: boolean;
}
