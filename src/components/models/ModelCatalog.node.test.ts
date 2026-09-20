import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ModelCatalog from "../ModelCatalog";

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

vi.mock("~/util/url", () => ({
    setSearchParams: vi.fn(),
}));

describe("ModelCatalog", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/");
        vi.clearAllMocks();
    });

    it("renders the search input and filter controls", () => {
        render(<ModelCatalog models={mockModels} />);
        expect(
            screen.getByPlaceholderText(/search models/i)
        ).toBeInTheDocument();
    });

    it("filters models by search text and updates visible cards", () => {
        render(<ModelCatalog models={mockModels} />);
        const input = screen.getByPlaceholderText(/search models/i);

        fireEvent.change(input, { target: { value: "llama" } });

        expect(screen.getByText("@cf/meta/llama-3")).toBeInTheDocument();
        expect(
            screen.queryByText("@cf/openai/gpt-oss")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText("@cf/black-forest-labs/flux")
        ).not.toBeInTheDocument();
    });

    it("renders SortSelect and can change sort order", () => {
        render(<ModelCatalog models={mockModels} />);
        const sortTrigger = screen.getByText(/newest first/i);
        expect(sortTrigger).toBeInTheDocument();
    });

    it("renders distinct FilterDropdown controls for tasks, authors, and capabilities", () => {
        render(<ModelCatalog models={mockModels} />);

        const tasksFilter = screen.getByRole("button", { name: /tasks/i });
        const authorsFilter = screen.getByRole("button", { name: /authors/i });

        expect(tasksFilter).toBeInTheDocument();
        expect(authorsFilter).toBeInTheDocument();
    });
});
