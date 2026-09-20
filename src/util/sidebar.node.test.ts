import { describe, it, expect, vi } from "vitest";

// Mock the heavy Astro content collection APIs
vi.mock("astro:content", () => ({
    getCollection: vi.fn().mockResolvedValue([]),
    getEntry: vi.fn().mockResolvedValue(null),
}));

import {
    flattenSidebar,
    sortBySidebarOrder,
    getSidebarEntry,
    normalizeSidebarPath,
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

    describe("getSidebarEntry & Routing Logic", () => {
        const mockSidebarConfig = [
            {
                group: "ai-gateway",
                label: "AI Gateway",
                href: "/ai-gateway/",
                badge: { text: "Beta", variant: "caution" },
            },
            {
                group: "workers",
                label: "Workers",
                href: "/workers/",
            },
        ];

        it("returns sidebar entry matching target group key", () => {
            const entry = getSidebarEntry(mockSidebarConfig as any, "ai-gateway");
            expect(entry.label).toBe("AI Gateway");
            expect(entry.href).toBe("/ai-gateway/");
        });

        it("correctly identifies and preserves beta badge metadata", () => {
            const entry = getSidebarEntry(mockSidebarConfig as any, "ai-gateway");
            expect(entry.badge).toBeDefined();
            expect(entry.badge?.text).toBe("Beta");
            expect(entry.badge?.variant).toBe("caution");
        });

        it("throws an explicit error when requesting a missing or non-existent group", () => {
            expect(() =>
                getSidebarEntry(mockSidebarConfig as any, "non-existent-group")
            ).toThrow(/Missing group for slug: non-existent-group/i);
        });

        it("normalizes trailing slashes and multiple slash variants for path matching", () => {
            expect(normalizeSidebarPath("/docs/api/")).toBe("/docs/api");
            expect(normalizeSidebarPath("/docs/api///")).toBe("/docs/api");
            expect(normalizeSidebarPath("/docs/api")).toBe("/docs/api");
        });
    });
});
