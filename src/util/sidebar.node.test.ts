import { describe, it, expect, vi } from "vitest";

// We mock the heavy Astro content collection APIs
vi.mock("astro:content", () => ({
    getCollection: vi.fn().mockResolvedValue([]),
    getEntry: vi.fn().mockResolvedValue(null),
}));

// Import after mocks
import {
    flattenSidebar,
    sortBySidebarOrder,
    // getSidebar and generateSidebar are harder to unit-test in isolation
    // because they depend on AstroGlobal + content collections.
    // Focus on the pure helpers first.
} from "./sidebar";

describe("sidebar helpers", () => {
    describe("flattenSidebar", () => {
        it("flattens nested groups into a list of links", () => {
            const nested = [
                {
                    type: "group" as const,
                    label: "Parent",
                    entries: [
                        { type: "link" as const, label: "Child 1", href: "/a/", isCurrent: false, attrs: {}, badge: undefined },
                        {
                            type: "group" as const,
                            label: "Nested",
                            entries: [
                                { type: "link" as const, label: "Child 2", href: "/b/", isCurrent: false, attrs: {}, badge: undefined },
                            ],
                            collapsed: false,
                            badge: undefined,
                        },
                    ],
                    collapsed: false,
                    badge: undefined,
                },
            ];

            const flat = flattenSidebar(nested as any);
            expect(flat).toHaveLength(2);
            expect(flat[0].href).toBe("/a/");
            expect(flat[1].href).toBe("/b/");
        });

        it("returns an empty array for empty input", () => {
            expect(flattenSidebar([])).toEqual([]);
        });
    });

    describe("sortBySidebarOrder", () => {
        it("sorts by order ascending", () => {
            const a = { order: 10, label: "B" };
            const b = { order: 5, label: "A" };
            expect(sortBySidebarOrder(a, b)).toBeGreaterThan(0);
            expect(sortBySidebarOrder(b, a)).toBeLessThan(0);
        });

        it("falls back to label comparison when order is equal", () => {
            const a = { order: 1, label: "Alpha" };
            const b = { order: 1, label: "Beta" };
            expect(sortBySidebarOrder(a, b)).toBeLessThan(0);
        });
    });
});
