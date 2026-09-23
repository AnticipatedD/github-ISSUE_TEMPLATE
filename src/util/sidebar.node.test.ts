import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flattenSidebar, sortBySidebarOrder, getSidebar, generateSidebar } from './sidebar';
import type { SidebarEntry } from './sidebar';

// Mock astro:content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (collectionName) => {
    if (collectionName === 'directory') {
      return [
        { data: { id: 'workers', name: 'Workers', entry: { url: '/workers/' } } }
      ];
    }
    if (collectionName === 'product-availability') {
      return [
        { id: 'workers', data: { availability: 'generally available' } }
      ];
    }
    return [];
  }),
  getEntry: vi.fn(async () => ({
    data: {
      title: 'Overview',
      sidebar: { order: 0, label: 'Overview' },
    },
  })),
}));

describe('Sidebar Utility & Routing Functions', () => {
  it('flattens nested sidebar groups and links correctly', () => {
    const mockSidebar: SidebarEntry[] = [
      {
        type: 'link',
        label: 'Overview',
        href: '/overview/',
        isCurrent: false,
        attrs: {},
      },
      {
        type: 'group',
        label: 'Workers',
        entries: [
          {
            type: 'link',
            label: 'Get Started',
            href: '/workers/get-started/',
            isCurrent: false,
            attrs: {},
          },
        ],
        collapsed: false,
      },
    ];

    const flattened = flattenSidebar(mockSidebar);
    expect(flattened.length).toBe(2);
    expect(flattened[0].href).toBe('/overview/');
    expect(flattened[1].href).toBe('/workers/get-started/');
  });

  it('sorts sidebar entries correctly based on custom order and labels', () => {
    const itemA = { label: 'B Section', order: 2 };
    const itemB = { label: 'A Section', order: 1 };

    expect(sortBySidebarOrder(itemA, itemB)).toBeGreaterThan(0);
    expect(sortBySidebarOrder(itemB, itemA)).toBeLessThan(0);
  });

  it('handles sidebar group generation and metadata mapping', async () => {
    const mockGroup: any = {
      type: 'group',
      label: 'workers',
      entries: [
        {
          type: 'link',
          label: 'Workers Overview',
          href: '/workers/',
          isCurrent: false,
          attrs: {},
        },
      ],
      collapsed: false,
    };

    const result = await generateSidebar(mockGroup);
    expect(result).toBeDefined();
    expect(result.entries.length).toBeGreaterThan(0);
  });
});
