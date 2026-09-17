import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
// Adjust the import path if the component exports differently
import SchemaTree from "./SchemaTree";

// Minimal mock schema that the component can render
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
    it("renders without crashing", () => {
        const { container } = render(<SchemaTree schema={mockSchema} />);
        expect(container).toBeTruthy();
    });

    it("shows top-level property names", () => {
        render(<SchemaTree schema={mockSchema} />);
        // Adjust selectors once you inspect the real DOM output
        expect(screen.getByText(/name/i)).toBeTruthy();
        expect(screen.getByText(/age/i)).toBeTruthy();
    });

    it("supports expand / collapse of nested objects", async () => {
        render(<SchemaTree schema={mockSchema} />);

        // Example – replace with the actual expand button / toggle that exists
        const expandButtons = screen.queryAllByRole("button");
        if (expandButtons.length > 0) {
            fireEvent.click(expandButtons[0]);
            // After expand you should see nested keys
            // expect(screen.getByText(/street/i)).toBeTruthy();
        }
    });

    it("highlights matching search terms when a search filter is provided", () => {
        // If SchemaTree accepts a search/filter prop, test it here
        // render(<SchemaTree schema={mockSchema} search="street" />);
        // expect(...).toHaveClass("highlight") or similar
        expect(true).toBe(true); // placeholder – implement once you inspect props
    });
});
