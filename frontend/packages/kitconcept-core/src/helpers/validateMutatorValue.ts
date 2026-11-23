import type { StyleDefinition } from '@plone/types';
import type { TTWConfigurableType } from '../types';

/**
 * The result of a check: the valid value, or the reason it was refused.
 */
export type ValidationResult<T> = {
  valid: boolean;
  /** The checked value, when it is valid. */
  value?: T;
  /** Why the value was refused, when it is not valid. */
  reason?: string;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

// A CSS custom property name, such as `--theme-color`.
const CUSTOM_PROPERTY_NAME = /^--[A-Za-z0-9_-]+$/;

// Characters and functions that could end the declaration, open a new rule,
// close the style element, load an outside resource, or hide any of these
// behind a CSS escape.
const UNSAFE_CSS_VALUE =
  /[;{}<>\\]|url\s*\(|image-set\s*\(|@import|expression\s*\(/i;

/**
 * Checks a list of style definitions, as used by `themes` and by block color
 * lists such as `flagColors`.
 *
 * Each definition needs a string `name` and `label`, and a `style` object that
 * only sets CSS custom properties (`--…`) to plain values. Values must not
 * contain `;`, `{`, `}`, `<`, `>`, `\`, `url(`, `image-set(`, `@import` or
 * `expression(`. The whole list is refused if one definition is invalid.
 */
export function validateStyleDefinitions(
  value: unknown,
): ValidationResult<StyleDefinition[]> {
  if (!Array.isArray(value) || !value.length) {
    return { valid: false, reason: 'must be a non-empty list' };
  }

  for (const [index, definition] of value.entries()) {
    const at = `item ${index + 1}`;
    if (!isPlainObject(definition)) {
      return { valid: false, reason: `${at} must be an object` };
    }
    if (typeof definition.name !== 'string' || !definition.name) {
      return { valid: false, reason: `${at} needs a "name"` };
    }
    if (typeof definition.label !== 'string') {
      return { valid: false, reason: `${at} needs a "label"` };
    }
    if (!isPlainObject(definition.style)) {
      return { valid: false, reason: `${at} needs a "style" object` };
    }
    for (const [property, propertyValue] of Object.entries(definition.style)) {
      if (!CUSTOM_PROPERTY_NAME.test(property)) {
        return {
          valid: false,
          reason: `${at}: "${property}" is not a CSS custom property (--…)`,
        };
      }
      if (
        typeof propertyValue !== 'string' &&
        typeof propertyValue !== 'number'
      ) {
        return {
          valid: false,
          reason: `${at}: the value of "${property}" must be a string`,
        };
      }
      if (UNSAFE_CSS_VALUE.test(String(propertyValue))) {
        return {
          valid: false,
          reason: `${at}: the value of "${property}" contains a character or function that is not allowed`,
        };
      }
    }
  }

  return { valid: true, value: value as StyleDefinition[] };
}

const VALIDATORS: Record<
  TTWConfigurableType,
  (value: unknown) => ValidationResult<unknown>
> = {
  styleDefinitions: validateStyleDefinitions,
};

/**
 * Checks a value against a value type that a block allows to be changed
 * through the web.
 */
export function validateMutatorValue(
  type: TTWConfigurableType,
  value: unknown,
): ValidationResult<unknown> {
  const validator = VALIDATORS[type];
  if (!validator) {
    return { valid: false, reason: `has an unknown value type "${type}"` };
  }
  return validator(value);
}
