import { describe, it, expect } from "vitest";
import { formatEquation, formatResult } from "./formatEquation";

describe("formatEquation", () => {
  it("replaces * with ×", () => expect(formatEquation("3*4")).toBe("3×4"));
  it("replaces / with ÷", () => expect(formatEquation("8/2")).toBe("8÷2"));
  it("leaves other chars intact", () =>
    expect(formatEquation("(1+2)")).toBe("(1+2)"));
  it("handles empty string", () => expect(formatEquation("")).toBe(""));
});

describe("formatResult", () => {
  it("formats integer", () => expect(formatResult(42)).toBe("42"));
  it("trims trailing zeros", () => expect(formatResult(1.5)).toBe("1.5"));
  it("handles 0.3 precision", () => expect(formatResult(0.3)).toBe("0.3"));
});
