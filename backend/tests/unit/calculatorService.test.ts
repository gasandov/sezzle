import { calculate, isFailure } from '../../src/services/calculatorService';

describe('calculatorService', () => {
  const calc = (eq: string) => {
    const r = calculate(eq);
    if (isFailure(r)) throw new Error(r.detail);
    return r.result;
  };

  describe('basic arithmetic', () => {
    it('adds', () => expect(calc('2 + 3')).toBe(5));
    it('subtracts', () => expect(calc('10 - 4')).toBe(6));
    it('multiplies', () => expect(calc('3 * 4')).toBe(12));
    it('divides', () => expect(calc('8 / 2')).toBe(4));
  });

  describe('operator precedence', () => {
    it('respects PEMDAS — multiply before add', () => expect(calc('2 + 3 * 4')).toBe(14));
    it('respects PEMDAS — parentheses override', () => expect(calc('(2 + 3) * 4')).toBe(20));
    it('handles nested parentheses', () => expect(calc('((2 + 3) * (1 + 1))')).toBe(10));
    it('chains multiple operators', () => expect(calc('2 + 3 - 1 * 4 / 2')).toBe(3));
  });

  describe('advanced functions', () => {
    it('computes sqrt', () => expect(calc('sqrt(16)')).toBe(4));
    it('computes pow', () => expect(calc('pow(2, 8)')).toBe(256));
    it('computes percentage', () => expect(calc('50%')).toBe(0.5));
    it('combines sqrt and addition', () => expect(calc('sqrt(9) + 1')).toBe(4));
    it('uses exponent operator ^', () => expect(calc('2^10')).toBe(1024));
  });

  describe('float precision', () => {
    it('handles 0.1 + 0.2', () => expect(calc('0.1 + 0.2')).toBeCloseTo(0.3, 10));
    it('handles long decimal chains', () => expect(calc('1.1 * 3')).toBeCloseTo(3.3, 10));
  });

  describe('unary minus', () => {
    it('handles leading unary minus', () => expect(calc('-5 + 10')).toBe(5));
    it('handles double negation', () => expect(calc('10 + -3')).toBe(7));
  });

  describe('edge cases — failures', () => {
    it('returns failure on division by zero', () => {
      const r = calculate('5 / 0');
      expect(isFailure(r)).toBe(true);
      if (isFailure(r)) expect(r.error).toBe('Division by zero');
    });

    it('returns failure on empty equation', () => {
      const r = calculate('');
      expect(isFailure(r)).toBe(true);
    });

    it('returns failure on invalid characters', () => {
      const r = calculate('2 @ 3');
      expect(isFailure(r)).toBe(true);
    });

    it('returns failure on mismatched parentheses', () => {
      const r = calculate('(2 + 3');
      expect(isFailure(r)).toBe(true);
    });

    it('returns failure on sqrt of negative', () => {
      const r = calculate('sqrt(-4)');
      expect(isFailure(r)).toBe(true);
    });
  });
});
