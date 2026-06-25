import { tokenize, TokenizerError } from '../../src/utils/tokenizer';

describe('tokenizer', () => {
  it('tokenizes simple addition', () => {
    const tokens = tokenize('3 + 4');
    expect(tokens).toEqual([
      { type: 'NUMBER', value: '3' },
      { type: 'OPERATOR', value: '+' },
      { type: 'NUMBER', value: '4' },
    ]);
  });

  it('tokenizes "3+4" correctly', () => {
    const tokens = tokenize('3+4');
    expect(tokens).toEqual([
      { type: 'NUMBER', value: '3' },
      { type: 'OPERATOR', value: '+' },
      { type: 'NUMBER', value: '4' },
    ]);
  });

  it('tokenizes decimal numbers', () => {
    const tokens = tokenize('1.5 * 2');
    expect(tokens[0]).toEqual({ type: 'NUMBER', value: '1.5' });
  });

  it('tokenizes parentheses', () => {
    const tokens = tokenize('(2+3)');
    expect(tokens[0]).toEqual({ type: 'LEFT_PAREN', value: '(' });
    expect(tokens[tokens.length - 1]).toEqual({ type: 'RIGHT_PAREN', value: ')' });
  });

  it('handles unary minus at start', () => {
    const tokens = tokenize('-5 + 3');
    // unary minus becomes "0 -"
    expect(tokens[0]).toEqual({ type: 'NUMBER', value: '0' });
    expect(tokens[1]).toEqual({ type: 'OPERATOR', value: '-' });
    expect(tokens[2]).toEqual({ type: 'NUMBER', value: '5' });
  });

  it('handles unary minus after operator', () => {
    const tokens = tokenize('4 * -2');
    const minusIdx = tokens.findIndex((t) => t.type === 'OPERATOR' && t.value === '-');
    expect(minusIdx).toBeGreaterThan(-1);
  });

  it('tokenizes sqrt function', () => {
    const tokens = tokenize('sqrt(9)');
    expect(tokens[0]).toEqual({ type: 'FUNCTION', value: 'sqrt' });
  });

  it('tokenizes pow function', () => {
    const tokens = tokenize('pow(2,10)');
    expect(tokens[0]).toEqual({ type: 'FUNCTION', value: 'pow' });
  });

  it('tokenizes percentage', () => {
    const tokens = tokenize('50%');
    expect(tokens.some((t) => t.type === 'FUNCTION' && t.value === '%')).toBe(true);
  });

  it('throws on invalid character', () => {
    expect(() => tokenize('2 @ 3')).toThrow(TokenizerError);
  });

  it('throws on empty input', () => {
    expect(() => tokenize('')).toThrow(TokenizerError);
    expect(() => tokenize('   ')).toThrow(TokenizerError);
  });

  it('throws on unknown function name', () => {
    expect(() => tokenize('tan(1)')).toThrow(TokenizerError);
  });

  it('throws on double decimal', () => {
    expect(() => tokenize('1.2.3')).toThrow(TokenizerError);
  });
});
