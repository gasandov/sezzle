import { tokenize } from "../../src/utils/tokenizer";
import { shuntingYard, ParseError } from "../../src/utils/shuntingYard";

describe("shuntingYard", () => {
  const toRpn = (equation: string) => shuntingYard(tokenize(equation));

  const rpnValues = (equation: string) =>
    toRpn(equation).map((t) => t.value);

  it("converts basic precedence — multiply before add", () => {
    expect(rpnValues("2 + 3 * 4")).toEqual(["2", "3", "4", "*", "+"]);
  });

  it("converts single-argument function sqrt", () => {
    expect(rpnValues("sqrt(9)")).toEqual(["9", "sqrt:1"]);
  });

  it("converts two-argument function pow", () => {
    expect(rpnValues("pow(2, 10)")).toEqual(["2", "10", "pow:2"]);
  });

  it("converts postfix percentage", () => {
    expect(rpnValues("50%")).toEqual(["50", "%:1"]);
  });

  it("throws on mismatched left parenthesis", () => {
    expect(() => toRpn("(2 + 3")).toThrow(ParseError);
    expect(() => toRpn("(2 + 3")).toThrow("Mismatched parentheses");
  });

  it("throws on mismatched right parenthesis", () => {
    expect(() => toRpn("2 + 3)")).toThrow(ParseError);
    expect(() => toRpn("2 + 3)")).toThrow('Mismatched parentheses: missing "("');
  });
});
