import {
  add,
  subtract,
  multiply,
  divide,
  applyBasicOperator,
  DivisionByZeroError,
} from "../../src/services/basicMathService";

describe("basicMathService", () => {
  describe("add", () => {
    it("adds two positive numbers", () => expect(add(2, 3)).toBe(5));
    it("adds negative numbers", () => expect(add(-2, -3)).toBe(-5));
    it("adds zero", () => expect(add(5, 0)).toBe(5));
  });

  describe("subtract", () => {
    it("subtracts correctly", () => expect(subtract(10, 4)).toBe(6));
    it("returns negative when b > a", () => expect(subtract(3, 7)).toBe(-4));
  });

  describe("multiply", () => {
    it("multiplies two numbers", () => expect(multiply(3, 4)).toBe(12));
    it("multiplies by zero", () => expect(multiply(5, 0)).toBe(0));
    it("multiplies negatives", () => expect(multiply(-2, 3)).toBe(-6));
  });

  describe("divide", () => {
    it("divides correctly", () => expect(divide(10, 2)).toBe(5));
    it("returns decimal", () => expect(divide(1, 4)).toBe(0.25));
    it("throws DivisionByZeroError", () => {
      expect(() => divide(5, 0)).toThrow(DivisionByZeroError);
    });
  });

  describe("applyBasicOperator", () => {
    it("applies +", () => expect(applyBasicOperator("+", 1, 2)).toBe(3));
    it("applies -", () => expect(applyBasicOperator("-", 5, 3)).toBe(2));
    it("applies *", () => expect(applyBasicOperator("*", 4, 3)).toBe(12));
    it("applies /", () => expect(applyBasicOperator("/", 8, 2)).toBe(4));
    it("throws on unknown operator", () => {
      expect(() => applyBasicOperator("&", 1, 2)).toThrow(
        "Unknown basic operator",
      );
    });
  });
});
