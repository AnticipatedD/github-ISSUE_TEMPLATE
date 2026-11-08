import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import ResourcesBySelector from "./ResourcesBySelector";

// Mock ReactSelect and url utility
vi.mock("./ReactSelect", () => ({
    default: ({ onChange, value, placeholder }: any) => (
        <div data-testid="react-select" onClick={() => onChange({ value: "workers", label: "Workers" })}>
            {value ? value.label : placeholder}
        </div>
    ),
}));

vi.mock("~/util/url", () => ({
    setSearchParams: vi.fn(),
}));

vi.mock("~/util/content-type", () => ({
    formatContentType: (v: string) => v,
}));

describe("ResourcesBySelector Component", () => {
    const mockResources: any[] = [
        {
            id: "doc-1",
            collection: "docs",
            data: {
                title: "Workers Guide",
                description: "Learn about Cloudflare Workers",
                reviewed: new Date("2025-01-01"),
                productTitles: ["Workers"],
                pcx_content_type: "guide",
            },
        },
        {
            id: "doc-2",
            collection: "docs",
            data: {
                title: "Pages Overview",
                description: "Deploy fast static sites",
                reviewed: new Date("2025-02-01"),
                productTitles: ["Pages"],
                pcx_content_type: "overview",
            },
        },
    ];

    const mockFacets = {
        pcx_content_type: ["guide", "overview"],
        products: ["Workers", "Pages"],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders resources correctly in top filter placement", () => {
        render(
            <ResourcesBySelector
                resources={mockResources}
                facets={mockFacets}
                filters={["products"]}
                columns={2}
                showDescriptions={true}
                showLastUpdated={true}
                filterPlacement="top"
            />
        );

        expect(screen.getByText("Workers Guide")).toBeInTheDocument();
        expect(screen.getByText("Pages Overview")).toBeInTheDocument();
    });

    it("filters resources when top filter is selected", async () => {
        render(
            <ResourcesBySelector
                resources={mockResources}
                facets={mockFacets}
                filters={["products"]}
                columns={2}
                showDescriptions={true}
                showLastUpdated={true}
                filterPlacement="top"
            />
        );

        const select = screen.getByTestId("react-select");
        fireEvent.click(select);

        await waitFor(() => {
            expect(screen.getByText("Workers Guide")).toBeInTheDocument();
            expect(screen.queryByText("Pages Overview")).not.toBeInTheDocument();
        });
    });

    it("renders search input and facets in left filter placement", () => {
        render(
            <ResourcesBySelector
                resources={mockResources}
                facets={mockFacets}
                filters={["products"]}
                columns={1}
                showDescriptions={false}
                showLastUpdated={false}
                filterPlacement="left"
            />
        );

        expect(screen.getByPlaceholderText("Search resources")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
    });
});
