import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionReplacementModal from "@/components/session/SessionReplacementModal";

describe("SessionReplacementModal", () => {
  it("shows the active block title and both actions", () => {
    render(
      <SessionReplacementModal
        open
        activeBlockTitle="Focus 1"
        onKeepCurrent={vi.fn()}
        onStartNew={vi.fn()}
      />,
    );
    expect(screen.getByText(/session already active/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus 1/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /keep current/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start new/i })).toBeInTheDocument();
  });

  it("calls onStartNew when Start New is clicked", async () => {
    const onStartNew = vi.fn();
    const user = userEvent.setup();
    render(
      <SessionReplacementModal
        open
        activeBlockTitle="Focus 1"
        onKeepCurrent={vi.fn()}
        onStartNew={onStartNew}
      />,
    );
    await user.click(screen.getByRole("button", { name: /start new/i }));
    expect(onStartNew).toHaveBeenCalledTimes(1);
  });

  it("treats Escape (dismiss) as Keep Current", async () => {
    const onKeepCurrent = vi.fn();
    const user = userEvent.setup();
    render(
      <SessionReplacementModal
        open
        activeBlockTitle="Focus 1"
        onKeepCurrent={onKeepCurrent}
        onStartNew={vi.fn()}
      />,
    );
    await user.keyboard("{Escape}");
    expect(onKeepCurrent).toHaveBeenCalled();
  });
});
