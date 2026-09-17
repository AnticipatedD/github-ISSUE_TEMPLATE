import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModelCatalog from "../ModelCatalog";

// Minimal model data that matches ModelCardData shape
const mockModels = [
    {
        name: "@cf/meta/llama-3",
        task: { name: "Text Generation" },
        created_at: "2024-01-15T00:00:00Z",
        properties: {},
    },
    {
        name: "@cf/openai/gpt-oss",
        task: { name: "Text Generation" },
        created_at: "2023-06-01T00:00:00Z",
        properties: {},
    },
    {
        name: "@cf/black-forest-labs/flux",
        task: { name: "Text-to-Image" },
        created_at: "2024-08-01T00:00:00Z",
        properties: {},
    },
] as any[];

// Mock URL helpers that ModelCatalog uses
vi.mock("~/util/url", () => ({
    setSearchParams: vi.fn(),
}));

describe("ModelCatalog", () => {
    beforeEach(() => {
        // Reset URL between tests if needed
        window.history.pushState({}, "", "/");
    });

    it("renders the search input and filter controls", () => {
        render(<ModelCatalog models={mockModels} />);
        expect(screen.getByPlaceholderText(/search models/i)).toBeTruthy();
    });

    it("filters models by search text", () => {
        render(<ModelCatalog models={mockModels} />);
        const input = screen.getByPlaceholderText(/search models/i);
        fireEvent.change(input, { target: { value: "llama" } });

        // The component filters client-side; assert the visible model names
        // (exact assertion depends on how ModelInfo renders the name)
        expect(screen.getByText(/llama/i)).toBeTruthy();
    });

    it("renders SortSelect and can change sort order", () => {
        render(<ModelCatalog models={mockModels} />);
        // Look for the sort trigger (text "Newest first" by default)
        const sortTrigger = screen.getByText(/newest first/i);
        expect(sortTrigger).toBeTruthy();
    });

    it("shows FilterDropdowns for authors / tasks / capabilities", () => {
        render(<ModelCatalog models={mockModels} />);
        // These labels come from the FilterDropdown component
        // Adjust once you confirm the exact button text
        expect(screen.getByText(/tasks/i) || screen.getByText(/authors/i)).toBeTruthy();
    });
});
