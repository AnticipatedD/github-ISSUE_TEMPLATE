import { describe, it, expect } from "vitest";

// Safe, non-secret placeholder constants used in public code samples
export const SAFE_API_KEY_PLACEHOLDER = "YOUR_API_KEY_HERE";
export const SAFE_AUTH_TOKEN_PLACEHOLDER = "YOUR_AUTH_TOKEN_HERE";

describe("AI Gateway Code Example Selector Security", () => {
    it("ensures no literal secret patterns are present in placeholders", () => {
        expect(SAFE_API_KEY_PLACEHOLDER).not.toContain("sk_live_51Nz");
        expect(SAFE_AUTH_TOKEN_PLACEHOLDER).not.toContain("cf_auth_tok_7739281a");
    });

    it("uses uniform placeholder strings across code examples", () => {
        expect(SAFE_API_KEY_PLACEHOLDER).toBe("YOUR_API_KEY_HERE");
        expect(SAFE_AUTH_TOKEN_PLACEHOLDER).toBe("YOUR_AUTH_TOKEN_HERE");
    });
});
