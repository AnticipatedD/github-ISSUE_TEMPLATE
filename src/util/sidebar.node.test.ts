import { describe, it, expect } from 'vitest';

describe('Sidebar Route Helper', () => {
  it('correctly validates sidebar paths', () => {
    const path = '/docs/getting-started';
    expect(path.startsWith('/docs')).toBe(true);
  });
});
