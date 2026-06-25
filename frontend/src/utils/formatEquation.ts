/** Replaces internal operator symbols with display-friendly equivalents. */
export function formatEquation(eq: string): string {
  return eq.replace(/\*/g, "×").replace(/\//g, "÷");
}

/** Formats a numeric result, trimming unnecessary trailing zeros. */
export function formatResult(value: number): string {
  const str = value.toPrecision(12);
  const num = parseFloat(str);
  return String(num);
}
