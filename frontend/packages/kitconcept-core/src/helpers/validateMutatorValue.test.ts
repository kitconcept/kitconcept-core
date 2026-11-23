import { describe, it, expect } from 'vitest';
import {
  validateMutatorValue,
  validateStyleDefinitions,
} from './validateMutatorValue';

const definition = (style: Record<string, unknown>) => ({
  name: 'dlr-blue',
  label: 'DLR blue',
  style,
});

describe('validateStyleDefinitions', () => {
  it('accepts CSS custom properties with plain values', () => {
    const value = [
      definition({
        '--theme-color': '#00678B',
        '--theme-foreground-color': 'rgb(255 255 255 / 80%)',
        '--size': 2,
      }),
    ];
    expect(validateStyleDefinitions(value)).toEqual({ valid: true, value });
  });

  it.each([
    ['not a list', 'nope'],
    ['an empty list', []],
    ['an item that is not an object', ['nope']],
    ['an item without a name', [{ label: 'X', style: {} }]],
    ['an item without a label', [{ name: 'x', style: {} }]],
    ['an item without a style', [{ name: 'x', label: 'X' }]],
  ])('refuses %s', (_, value) => {
    expect(validateStyleDefinitions(value).valid).toBe(false);
  });

  it.each([
    ['a regular CSS property', { color: 'red' }],
    ['a value that ends the declaration', { '--c': 'red; color: blue' }],
    ['a value that opens a rule', { '--c': 'red} body {color: blue' }],
    ['a value that closes the style element', { '--c': '</style><script>' }],
    ['an outside resource', { '--c': 'url(https://example.com/x.png)' }],
    ['an escaped function', { '--c': 'u\\72l(x)' }],
    ['an image set', { '--c': 'image-set("x.png" 1x)' }],
    ['an import', { '--c': '@import "x.css"' }],
    ['an object value', { '--c': { a: 1 } }],
  ])('refuses %s', (_, style) => {
    expect(validateStyleDefinitions([definition(style)]).valid).toBe(false);
  });
});

describe('validateMutatorValue', () => {
  it.each(['nope', 'toString', '__proto__', 'constructor'])(
    'refuses the unknown value type "%s"',
    (type) => {
      expect(validateMutatorValue(type, []).valid).toBe(false);
    },
  );
});
