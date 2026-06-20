import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/redirects";

describe("safe redirects", () => {
  it("keeps local application paths", () => {
    expect(safeRedirectPath("/dashboard/goals?from=login")).toBe("/dashboard/goals?from=login");
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", null])(
    "rejects an external or malformed destination: %s",
    (destination) => {
      expect(safeRedirectPath(destination)).toBe("/dashboard");
    },
  );
});
