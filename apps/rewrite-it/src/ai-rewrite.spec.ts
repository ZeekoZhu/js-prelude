import { describe, it, expect, vi } from 'vitest';
import { aiRewrite } from '../src/ai-rewrite';

vi.mock('../src/ai-rewrite');

describe('AI Rewrite', () => {
  it('should be importable', () => {
    expect(aiRewrite).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof aiRewrite).toBe('function');
  });
});
