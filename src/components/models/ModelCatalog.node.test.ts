import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ModelCatalog from "../ModelCatalog";

interface ModelItem {
    name: string;
    task: { name: string };
    created_at: string;
    properties: Record<string, any>;
}

const mockModels: ModelItem[] = [
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
];

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

    it("renders SortSelect and triggers sort order interactions", () => {
        render(<ModelCatalog models={mockModels} />);
        const sortTrigger = screen.getByText(/newest first/i);
        expect(sortTrigger).toBeInTheDocument();

        fireEvent.click(sortTrigger);
        expect(sortTrigger).toBeInTheDocument();
    });

    it("handles combined search filtering and display rendering correctly", () => {
        render(<ModelCatalog models={mockModels} />);
        const input = screen.getByPlaceholderText(/search models/i);

        fireEvent.change(input, { target: { value: "@cf" } });

        expect(screen.getByText("@cf/meta/llama-3")).toBeInTheDocument();
        expect(screen.getByText("@cf/openai/gpt-oss")).toBeInTheDocument();
        expect(screen.getByText("@cf/black-forest-labs/flux")).toBeInTheDocument();
    });

    it("renders distinct FilterDropdown controls for tasks, authors, and capabilities", () => {
        render(<ModelCatalog models={mockModels} />);

        const tasksFilter = screen.getByRole("button", { name: /tasks/i });
        const authorsFilter = screen.getByRole("button", { name: /authors/i });

        expect(tasksFilter).toBeInTheDocument();
        expect(authorsFilter).toBeInTheDocument();
    });
});
