import { afterEach, describe, expect, it, vi } from "vitest";
import { jsonRequest, requestJson } from "@/lib/api-client";

afterEach(() => vi.unstubAllGlobals());

describe("API client", () => {
  it("returns typed data from a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { id: "1" } }), { status: 200 })),
    );
    await expect(requestJson<{ id: string }>("/api/test")).resolves.toEqual({ id: "1" });
  });

  it("throws the safe server error for a failed response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Unable to save" }), { status: 500 })),
    );
    await expect(requestJson("/api/test")).rejects.toThrow("Unable to save");
  });

  it("builds JSON mutation requests consistently", () => {
    expect(jsonRequest("POST", { value: 2 })).toEqual({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"value":2}',
    });
  });
});
