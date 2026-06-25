import { CalculateApiResponse, ApiErrorResponse } from "../types";

const BASE_URL = "/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

export async function calculateEquation(
  equation: string,
): Promise<CalculateApiResponse> {
  const response = await fetch(`${BASE_URL}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equation }),
  });

  if (!response.ok) {
    const body: ApiErrorResponse = await response.json().catch(() => ({
      error: "Request failed",
      detail: `HTTP ${response.status}`,
    }));
    throw new ApiError(response.status, body.detail ?? body.error);
  }

  return response.json() as Promise<CalculateApiResponse>;
}
