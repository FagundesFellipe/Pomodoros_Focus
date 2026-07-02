import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import CountdownOverlay from "@/components/session/CountdownOverlay";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe("CountdownOverlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down 3 → 2 → 1 and fires onComplete once", () => {
    const onComplete = vi.fn();
    render(<CountdownOverlay onComplete={onComplete} />);

    expect(screen.getByText("3")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("2")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("exposes an assertive live region for screen readers", () => {
    render(<CountdownOverlay onComplete={vi.fn()} />);
    expect(screen.getByText("3")).toHaveAttribute("aria-live", "assertive");
  });

  it("omits the animation class when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(<CountdownOverlay onComplete={vi.fn()} />);
    expect(screen.getByText("3").className).not.toContain("animate-in");
  });

  it("applies the animation class when motion is allowed", () => {
    mockMatchMedia(false);
    render(<CountdownOverlay onComplete={vi.fn()} />);
    expect(screen.getByText("3").className).toContain("animate-in");
  });
});
