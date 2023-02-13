import { expect, test } from 'vitest';
import { FormField } from './form-field';
import { FormValidator } from './form-validator';

describe('FormValidator', () => {
  test('sync validator', async () => {
    const field = new FormField(5);
    const validator = new FormValidator<number>(field, {
      validator(value: number) {
        if (value < 10) {
          return ['value should be greater than 10'];
        }
        return;
      },
    });
    await validator.validate();
    expect(field.errors).toMatchInlineSnapshot(`
      [
        "value should be greater than 10",
      ]
    `);
  });

  describe('async validator', () => {
    test('should be validating when async validator is not resolved', async () => {
      const field = new FormField(5);
      let resolve: (errors: string[] | undefined) => void;
      const validator = new FormValidator<number>(field, {
        asyncValidator() {
          return new Promise((r) => {
            resolve = r;
          });
        },
      });
      const validation = validator.validate();
      expect(field.isValidating).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      resolve!(['error']);
      await validation;
      expect(field.isValidating).toBe(false);
      expect(field.errors).toMatchInlineSnapshot(`
        [
          "error",
        ]
      `);
    });
  });
  describe('error handling', () => {
    test('sync validator throws error', async () => {
      const field = new FormField(5);
      const validator = new FormValidator<number>(field, {
        validator() {
          throw new Error('error');
        },
      });
      await expect(() => validator.validate()).rejects.toMatchInlineSnapshot(
        '[Error: error]',
      );
      expect(field.isValid).toBeTruthy();
    });
  });
});
