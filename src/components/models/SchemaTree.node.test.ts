import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import SchemaTree from "./SchemaTree";

const mockSchema = {
    type: "object",
    properties: {
        name: { type: "string", description: "User name" },
        age: { type: "number" },
        address: {
            type: "object",
            properties: {
                street: { type: "string" },
                city: { type: "string" },
            },
        },
    },
};

describe("SchemaTree", () => {
    it("renders without crashing and mounts container", () => {
        const { container } = render(<SchemaTree schema={mockSchema} />);
        expect(container.firstChild).not.toBeNull();
    });

    it("shows top-level property names in the DOM", () => {
        render(<SchemaTree schema={mockSchema} />);
        expect(screen.getByText("name")).toBeInTheDocument();
        expect(screen.getByText("age")).toBeInTheDocument();
    });

    it("supports expand / collapse of nested objects", async () => {
        render(<SchemaTree schema={mockSchema} />);

        const expandButton = screen.getByRole("button", { name: /address/i });
        expect(expandButton).toBeInTheDocument();

        fireEvent.click(expandButton);

        expect(await screen.findByText("street")).toBeInTheDocument();
        expect(screen.getByText("city")).toBeInTheDocument();
    });

    it("highlights matching search terms when a search filter is provided", () => {
        render(<SchemaTree schema={mockSchema} search="street" />);

        const highlightElement = screen.getByText((content, element) => {
            return (
                element?.tagName.toLowerCase() === "mark" &&
                element.textContent === "street"
            );
        });

        expect(highlightElement).toBeInTheDocument();
        expect(highlightElement).toHaveClass("highlight");
    });
});
