import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TraditionalForm from "@/components/traditional/TraditionalForm";
import type { Session } from "@/lib/types/session";

// ── mocks ──────────────────────────────────────────────────────────────────

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

const mockSaveSession = vi.fn();
vi.mock("@/lib/session/storage", () => ({
  saveSession: (session: Session) => mockSaveSession(session),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// ── tests ─────────────────────────────────────────────────────────────────

describe("TraditionalForm", () => {
  it("renders duration, cycles and auto-advance fields", () => {
    render(<TraditionalForm />);
    expect(screen.getByText("Focus Duration")).toBeInTheDocument();
    expect(screen.getByText("Rest Duration")).toBeInTheDocument();
    expect(screen.getByText("Number of Cycles")).toBeInTheDocument();
    expect(screen.getByText("Auto-advance to next block")).toBeInTheDocument();
  });

  it("shows preview block count based on cycles (default 4 -> 8 blocks)", () => {
    render(<TraditionalForm />);
    expect(
      screen.getByText(/4 cycles will generate 8 blocks/i),
    ).toBeInTheDocument();
  });

  it("updates preview when cycles change", async () => {
    const user = userEvent.setup();
    render(<TraditionalForm />);
    const cyclesInput = screen.getByLabelText("Number of Cycles");
    await user.clear(cyclesInput);
    await user.type(cyclesInput, "3");
    expect(
      await screen.findByText(/3 cycles will generate 6 blocks/i),
    ).toBeInTheDocument();
    // preview lists the alternating sequence
    expect(screen.getByText("Focus 1")).toBeInTheDocument();
    expect(screen.getByText("Rest 3")).toBeInTheDocument();
  });

  it("uses singular 'cycle' for a single cycle", async () => {
    const user = userEvent.setup();
    render(<TraditionalForm />);
    const cyclesInput = screen.getByLabelText("Number of Cycles");
    await user.clear(cyclesInput);
    await user.type(cyclesInput, "1");
    expect(
      await screen.findByText(/1 cycle will generate 2 blocks/i),
    ).toBeInTheDocument();
  });

  it("creates a session and navigates to /prepare on submit", async () => {
    const user = userEvent.setup();
    render(<TraditionalForm />);
    await user.click(screen.getByRole("button", { name: /start session/i }));

    await waitFor(() => expect(mockSaveSession).toHaveBeenCalledTimes(1));
    const session = mockSaveSession.mock.calls[0][0] as Session;
    expect(session.snapshot).toHaveLength(8); // 4 cycles * 2
    expect(session.state).toBe("idle");
    expect(localStorageMock.getItem("activeSessionId")).toBe("traditional");
    expect(mockPush).toHaveBeenCalledWith("/prepare");
  });

  it("persists auto-advance setting in the created session", async () => {
    const user = userEvent.setup();
    render(<TraditionalForm />);
    await user.click(screen.getByRole("switch"));
    await user.click(screen.getByRole("button", { name: /start session/i }));

    await waitFor(() => expect(mockSaveSession).toHaveBeenCalledTimes(1));
    const session = mockSaveSession.mock.calls[0][0] as Session;
    expect(session.config.autoAdvance).toBe(true);
  });

  it("blocks submission when focus duration is invalid (0m)", async () => {
    const user = userEvent.setup();
    render(<TraditionalForm />);
    const focusMinutes = screen.getAllByLabelText("Minutes")[0];
    await user.clear(focusMinutes);
    await user.type(focusMinutes, "0");
    await user.click(screen.getByRole("button", { name: /start session/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/focus duration must be at least 1 minute/i),
      ).toBeInTheDocument(),
    );
    expect(mockSaveSession).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
