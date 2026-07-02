import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PreparationScreen from "@/components/session/PreparationScreen";
import type { Session } from "@/lib/types/session";
import type { RoutineWithBlocks } from "@/lib/types/routine";

// ── mocks ──────────────────────────────────────────────────────────────────
const mockPush = vi.fn();
const mockReplace = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => searchParams,
}));

const mockLoadSession = vi.fn();
const mockSaveSession = vi.fn();
const mockClearSession = vi.fn();
vi.mock("@/lib/session/storage", () => ({
  loadSession: () => mockLoadSession(),
  saveSession: (s: Session) => mockSaveSession(s),
  clearSession: () => mockClearSession(),
}));

const mockPostMessage = vi.fn();
vi.mock("@/lib/session/sync", () => ({
  SessionSyncChannel: class {
    postMessage = mockPostMessage;
    close = vi.fn();
    onMessage = vi.fn();
  },
}));

// The countdown is unit-tested separately; stub it so the start flow is
// deterministic — clicking the stub simulates the countdown finishing.
vi.mock("@/components/session/CountdownOverlay", () => ({
  default: ({ onComplete }: { onComplete: () => void }) => (
    <button data-testid="countdown-done" onClick={onComplete}>
      countdown
    </button>
  ),
}));

// ── fixtures ─────────────────────────────────────────────────────────────
function stagedTraditionalSession(): Session {
  return {
    snapshot: [
      {
        id: "traditional-0",
        type: "focus",
        title: "Focus 1",
        hours: 0,
        minutes: 25,
        background: "gradient-purple",
        position: 0,
      },
      {
        id: "traditional-1",
        type: "rest",
        title: "Rest 1",
        hours: 0,
        minutes: 5,
        background: "gradient-blue",
        position: 1,
      },
    ],
    currentBlockIndex: 0,
    state: "idle",
    timeRemaining: 0,
    expectedEndTime: 0,
    startedAt: 0,
    isPaused: false,
    config: { autoAdvance: true, soundEnabled: true },
    schemaVersion: 1,
  };
}

const routineResponse: RoutineWithBlocks = {
  id: "r1",
  userId: "u1",
  name: "Deep Work",
  autoAdvance: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  blocks: [
    {
      id: "blk-1",
      routineId: "r1",
      type: "focus",
      title: "Focus",
      durationMinutes: 50,
      position: 0,
      background: "gradient-purple",
      createdAt: new Date(),
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  searchParams = new URLSearchParams();
  mockLoadSession.mockReturnValue(null);
});

// ── tests ────────────────────────────────────────────────────────────────
describe("PreparationScreen — Traditional Mode", () => {
  it("renders the staged Traditional session summary", async () => {
    mockLoadSession.mockReturnValue(stagedTraditionalSession());
    render(<PreparationScreen />);
    expect(await screen.findByText("Traditional Mode")).toBeInTheDocument();
    expect(screen.getByText(/2 blocks · 30m total/i)).toBeInTheDocument();
    expect(screen.getByText("Focus 1")).toBeInTheDocument();
  });

  it("shows an error when there is no staged session", async () => {
    mockLoadSession.mockReturnValue(null);
    render(<PreparationScreen />);
    expect(await screen.findByText(/no session to prepare/i)).toBeInTheDocument();
  });

  it("starts the session and navigates to the timer after countdown", async () => {
    const user = userEvent.setup();
    // First call = load (idle staged); subsequent = active-session check (idle).
    mockLoadSession.mockReturnValue(stagedTraditionalSession());
    render(<PreparationScreen />);

    await user.click(await screen.findByRole("button", { name: /start session/i }));

    // Countdown appears and the start button is disabled (double-click guard).
    const countdown = await screen.findByTestId("countdown-done");
    expect(screen.getByRole("button", { name: /starting…/i })).toBeDisabled();

    await user.click(countdown);

    expect(mockSaveSession).toHaveBeenCalledTimes(1);
    const saved = mockSaveSession.mock.calls[0][0] as Session;
    expect(saved.state).toBe("running");
    expect(saved.expectedEndTime).toBeGreaterThan(0);
    expect(mockPostMessage).toHaveBeenCalledWith("SESSION_UPDATED", saved);
    expect(mockReplace).toHaveBeenCalledWith("/timer");
  });
});

describe("PreparationScreen — Routine Mode", () => {
  beforeEach(() => {
    searchParams = new URLSearchParams("routineId=r1");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => routineResponse,
    }) as unknown as typeof fetch;
  });

  it("fetches and renders the routine summary", async () => {
    render(<PreparationScreen />);
    expect(await screen.findByText("Deep Work")).toBeInTheDocument();
    expect(screen.getByText(/1 block · 50m total/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/routines/r1");
  });

  it("surfaces a fetch error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Not found." }),
    }) as unknown as typeof fetch;
    render(<PreparationScreen />);
    expect(await screen.findByText("Not found.")).toBeInTheDocument();
  });
});

describe("PreparationScreen — session replacement", () => {
  function activeSession(): Session {
    return { ...stagedTraditionalSession(), state: "running", currentBlockIndex: 0 };
  }

  it("prompts before discarding an active session and cancels on Keep Current", async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams("routineId=r1");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => routineResponse,
    }) as unknown as typeof fetch;
    // Active running session found during the start check.
    mockLoadSession.mockReturnValue(activeSession());

    render(<PreparationScreen />);
    await user.click(await screen.findByRole("button", { name: /start session/i }));

    expect(await screen.findByText(/session already active/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /keep current/i }));

    await waitFor(() =>
      expect(screen.queryByText(/session already active/i)).not.toBeInTheDocument(),
    );
    expect(mockSaveSession).not.toHaveBeenCalled();
    expect(mockClearSession).not.toHaveBeenCalled();
  });

  it("clears the old session and proceeds on Start New", async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams("routineId=r1");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => routineResponse,
    }) as unknown as typeof fetch;
    mockLoadSession.mockReturnValue(activeSession());

    render(<PreparationScreen />);
    await user.click(await screen.findByRole("button", { name: /start session/i }));
    await user.click(await screen.findByRole("button", { name: /start new/i }));

    expect(mockClearSession).toHaveBeenCalledTimes(1);
    expect(mockPostMessage).toHaveBeenCalledWith("SESSION_CLEARED", null);

    // Countdown then completes and starts the routine session.
    await user.click(await screen.findByTestId("countdown-done"));
    expect(mockSaveSession).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/timer");
  });
});
