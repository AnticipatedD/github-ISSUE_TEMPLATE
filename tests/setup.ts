import { vi, beforeEach } from 'vitest';

// Global mock for Fetch API to prevent external network calls during testing
global.fetch = vi.fn().mockImplementation(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  } as Response)
);

// Global mock for browser window location features
beforeEach(() => {
  vi.stubGlobal('location', {
    ...window.location,
    href: 'http://localhost:3000/',
    assign: vi.fn(),
    replace: vi.fn(),
  });
});
