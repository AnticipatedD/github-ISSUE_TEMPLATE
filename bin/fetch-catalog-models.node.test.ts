import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
    parseArgs,
    isDeprecated,
    loadFromFile,
    CatalogModel,
} from "./fetch-catalog-models";

describe("fetch-catalog-models build script", () => {
    const tempDir = path.join(process.cwd(), "temp-test-fixtures");
    const sampleFixturePath = path.join(tempDir, "sample-catalog.json");

    beforeEach(() => {
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        vi.restoreAllMocks();
    });

    describe("parseArgs", () => {
        it("extracts --file argument correctly when provided", () => {
            const result = parseArgs(["--file", "my-catalog.json"]);
            expect(result.file).toBe("my-catalog.json");
        });

        it("returns empty object when --file flag is missing", () => {
            const result = parseArgs(["--verbose", "--output", "dist"]);
            expect(result.file).toBeUndefined();
        });
    });

    describe("isDeprecated", () => {
        it("returns false if planned_deprecation_date is missing", () => {
            const model: Partial<CatalogModel> = { metadata: {} };
            expect(isDeprecated(model as CatalogModel)).toBe(false);
        });

        it("returns true if planned_deprecation_date is in the past", () => {
            const model: Partial<CatalogModel> = {
                metadata: { planned_deprecation_date: "2020-01-01T00:00:00Z" },
            };
            expect(isDeprecated(model as CatalogModel)).toBe(true);
        });

        it("returns false if planned_deprecation_date is in the future", () => {
            const model: Partial<CatalogModel> = {
                metadata: { planned_deprecation_date: "2099-01-01T00:00:00Z" },
            };
            expect(isDeprecated(model as CatalogModel)).toBe(false);
        });
    });

    describe("loadFromFile", () => {
        it("throws an error if the specified file does not exist", async () => {
            await expect(loadFromFile("non-existent-file.json")).rejects.toThrow(
                /File not found/,
            );
        });

        it("loads and filters out private and deprecated models from JSON fixture", async () => {
            const mockCatalogData: Partial<CatalogModel>[] = [
                {
                    model_id: "@cf/active/model-1",
                    private: false,
                    metadata: {},
                },
                {
                    model_id: "@cf/private/model-2",
                    private: true,
                    metadata: {},
                },
                {
                    model_id: "@cf/deprecated/model-3",
                    private: false,
                    metadata: { planned_deprecation_date: "2020-01-01T00:00:00Z" },
                },
            ];

            fs.writeFileSync(
                sampleFixturePath,
                JSON.stringify(mockCatalogData),
                "utf-8",
            );

            const activeModels = await loadFromFile(sampleFixturePath);

            expect(activeModels).toHaveLength(1);
            expect(activeModels[0].model_id).toBe("@cf/active/model-1");
        });
    });
});
