import { power, squareRoot, percentage, applyAdvFunction } from '../../src/services/advMathService';

describe('advMathService', () => {
  describe('power', () => {
    it('computes 2^10', () => expect(power(2, 10)).toBe(1024));
    it('computes x^0 = 1', () => expect(power(5, 0)).toBe(1));
    it('computes negative exponent', () => expect(power(2, -1)).toBe(0.5));
  });

  describe('squareRoot', () => {
    it('computes sqrt(9) = 3', () => expect(squareRoot(9)).toBe(3));
    it('computes sqrt(2)', () => expect(squareRoot(2)).toBeCloseTo(1.41421, 5));
    it('throws on negative input', () => {
      expect(() => squareRoot(-1)).toThrow('Square root of a negative number');
    });
  });

  describe('percentage', () => {
    it('converts 50 to 0.5', () => expect(percentage(50)).toBe(0.5));
    it('converts 100 to 1', () => expect(percentage(100)).toBe(1));
    it('converts 0 to 0', () => expect(percentage(0)).toBe(0));
  });

  describe('applyAdvFunction', () => {
    it('applies pow', () => expect(applyAdvFunction('pow', [3, 2])).toBe(9));
    it('applies sqrt', () => expect(applyAdvFunction('sqrt', [16])).toBe(4));
    it('applies %', () => expect(applyAdvFunction('%', [25])).toBe(0.25));
    it('throws on wrong arity for pow', () => {
      expect(() => applyAdvFunction('pow', [3])).toThrow('pow requires 2 arguments');
    });
    it('throws on wrong arity for sqrt', () => {
      expect(() => applyAdvFunction('sqrt', [4, 2])).toThrow('sqrt requires 1 argument');
    });
    it('throws on unknown function', () => {
      expect(() => applyAdvFunction('tan', [1])).toThrow('Unknown advanced function');
    });
  });
});
