import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

describe("shared controls accessibility", () => {
  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Carbon progress</h1>
        <Progress value={42} label="Monthly reduction goal" />
        <Button type="button">Add activity</Button>
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
