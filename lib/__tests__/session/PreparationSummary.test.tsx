import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PreparationSummary from "@/components/session/PreparationSummary";
import type { BlockSnapshot } from "@/lib/types/session";

const snapshot: readonly BlockSnapshot[] = [
  {
    id: "b0",
    type: "focus",
    title: "Focus 1",
    hours: 0,
    minutes: 25,
    background: "gradient-purple",
    position: 0,
  },
  {
    id: "b1",
    type: "rest",
    title: "Rest 1",
    hours: 1,
    minutes: 5,
    background: "gradient-blue",
    position: 1,
  },
];

describe("PreparationSummary", () => {
  it("shows name, block count and total duration", () => {
    render(
      <PreparationSummary
        name="Deep Work"
        snapshot={snapshot}
        config={{ autoAdvance: true, soundEnabled: false }}
      />,
    );
    expect(screen.getByText("Deep Work")).toBeInTheDocument();
    // 25m + 1h5m = 1h 30m total, 2 blocks
    expect(screen.getByText(/2 blocks · 1h 30m total/i)).toBeInTheDocument();
  });

  it("renders settings values", () => {
    render(
      <PreparationSummary
        name="Deep Work"
        snapshot={snapshot}
        config={{ autoAdvance: true, soundEnabled: false }}
      />,
    );
    expect(screen.getByText("Auto-advance").nextSibling).toHaveTextContent("On");
    expect(screen.getByText("Sound").nextSibling).toHaveTextContent("Off");
  });

  it("lists all blocks in order with titles and durations", () => {
    render(
      <PreparationSummary
        name="Deep Work"
        snapshot={snapshot}
        config={{ autoAdvance: false, soundEnabled: true }}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Focus 1");
    expect(items[0]).toHaveTextContent("25m");
    expect(items[1]).toHaveTextContent("Rest 1");
    expect(items[1]).toHaveTextContent("1h 5m");
  });

  it("highlights the first block", () => {
    render(
      <PreparationSummary
        name="Deep Work"
        snapshot={snapshot}
        config={{ autoAdvance: false, soundEnabled: true }}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0].className).toContain("border-primary");
    expect(items[1].className).not.toContain("border-primary");
  });
});
