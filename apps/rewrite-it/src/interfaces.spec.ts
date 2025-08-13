import { describe, it, expect } from 'vitest';
import { SLUGIFY_RECIPE } from '../src/interfaces';

describe('Interfaces', () => {
  it('should have SLUGIFY_RECIPE defined', () => {
    expect(SLUGIFY_RECIPE).toBeDefined();
    expect(typeof SLUGIFY_RECIPE).toBe('object');
    expect(SLUGIFY_RECIPE.name).toBe('slugify');
    expect(SLUGIFY_RECIPE.prompt).toContain('URL-safe slug');
  });
});
