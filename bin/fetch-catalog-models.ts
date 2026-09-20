import fs from "node:fs";
import path from "node:path";
import { scriptLog } from "../src/util/logger";

export interface CatalogModel {
    model_id: string;
    provider_id: string | null;
    name: string;
    description: string;
    task: string;
    tags: string[];
    context_length: number | null;
    max_output_tokens: number | null;
    supports_async: boolean;
    examples: Array<{
        name: string;
        description?: string;
        input: Record<string, unknown>;
        output: Record<string, unknown>;
    }>;
    default_example?: {
        input?: Record<string, unknown>;
        output?: Record<string, unknown>;
    };
    code_snippets?: Array<{
        label: string;
        code: string;
    }>;
    schema?: {
        input?: Record<string, unknown>;
        output?: Record<string, unknown>;
    };
    metadata: Record<string, unknown>;
    external_info: string | null;
    terms: string | null;
    cover_image_url: string | null;
    schema_version: string | null;
    private?: boolean;
    created_at?: string;
    updated_at?: string;
    pricing?: Record<string, unknown>;
}

export interface CatalogListResponse {
    success: boolean;
    result: CatalogModel[];
    result_info?: {
        count: number;
        page: number;
        per_page: number;
        total_count: number;
    };
    errors?: Array<{ message: string }>;
}

export function getPlannedDeprecationDate(model: CatalogModel): string | undefined {
    const metadata = model.metadata as Record<string, unknown> | undefined;
    const value = metadata?.planned_deprecation_date;
    return typeof value === "string" ? value : undefined;
}

export function isDeprecated(model: CatalogModel): boolean {
    const plannedDeprecationDate = getPlannedDeprecationDate(model);
    if (!plannedDeprecationDate) {
        return false;
    }
    const timestamp = new Date(plannedDeprecationDate).getTime();
    return !Number.isNaN(timestamp) && Date.now() > timestamp;
}

export function parseArgs(argsInput?: string[]): { file?: string } {
    const args = argsInput || process.argv.slice(2);
    const fileIndex = args.indexOf("--file");
    if (fileIndex !== -1 && args[fileIndex + 1]) {
        return { file: args[fileIndex + 1] };
    }
    return {};
}

export async function loadFromFile(filePath: string): Promise<CatalogModel[]> {
    scriptLog("INFO", "Loading models from file", { filePath });

    if (!fs.existsSync(filePath)) {
        scriptLog("ERROR", "File not found", { filePath });
        throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content) as CatalogListResponse | CatalogModel[];

    let models: CatalogModel[];
    if (Array.isArray(data)) {
        models = data;
    } else if (data.result) {
        models = data.result;
    } else {
        scriptLog("ERROR", "Unrecognized file format", { filePath });
        throw new Error("Unrecognized file format");
    }

    const publicModels = models.filter((m) => !m.private);
    const activeModels = publicModels.filter((m) => !isDeprecated(m));

    scriptLog("INFO", "Loaded catalog models from file", {
        totalLoaded: models.length,
        activeModels: activeModels.length,
        skippedPrivate: models.length - publicModels.length,
        skippedDeprecated: publicModels.length - activeModels.length,
    });

    return activeModels;
}
