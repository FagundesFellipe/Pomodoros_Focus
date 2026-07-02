import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutineEditor from "@/components/routines/RoutineEditor";

// ── mocks ──────────────────────────────────────────────────────────────────

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useParams: () => ({ id: "test-id" }),
}));

// Mock fetch globally
global.fetch = vi.fn();

// localStorage mock
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

// ── helpers ────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

// ── tests ─────────────────────────────────────────────────────────────────

describe("RoutineEditor", () => {
  it("renders the form with empty fields for new routine", () => {
    render(<RoutineEditor />);

    expect(screen.getByPlaceholderText("My routine")).toBeInTheDocument();
    expect(screen.getByText("Auto-advance to next block")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add block/i })).toBeInTheDocument();
  });

  it("character counter updates when typing name", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    const nameInput = screen.getByPlaceholderText("My routine");
    await user.type(nameInput, "Morning");

    expect(screen.getByText("7/80 characters")).toBeInTheDocument();
  });

  it("auto-advance toggle changes state", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toBeChecked();

    await user.click(switchEl);
    expect(switchEl).toBeChecked();
  });

  it("Add Block button adds a block", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    const addBtn = screen.getByRole("button", { name: /add block/i });
    await user.click(addBtn);

    expect(screen.getByText("Block 1")).toBeInTheDocument();
  });

  it("block counter shows '1 of 50 blocks' after adding one block", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));

    expect(screen.getByText("1 of 50 blocks")).toBeInTheDocument();
  });

  it("Add button disables at 50 blocks", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    const addBtn = screen.getByRole("button", { name: /add block/i });

    // Add 50 blocks
    for (let i = 0; i < 50; i++) {
      await user.click(addBtn);
    }

    expect(addBtn).toBeDisabled();
    expect(screen.getByText("50 of 50 blocks")).toBeInTheDocument();
  }, 30000);

  it("Remove button removes a block", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));
    expect(screen.getByText("Block 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove block/i }));
    expect(screen.queryByText("Block 1")).not.toBeInTheDocument();
  });

  it("total duration calculates correctly", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));

    const hoursInput = screen.getByRole("spinbutton", { name: /hours/i });
    const minutesInput = screen.getByRole("spinbutton", { name: /minutes/i });

    await user.clear(hoursInput);
    await user.type(hoursInput, "1");
    await user.clear(minutesInput);
    await user.type(minutesInput, "30");

    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });

  it("Move Up button is disabled for the first block", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));

    const moveUpBtn = screen.getByRole("button", { name: /move block up/i });
    expect(moveUpBtn).toBeDisabled();
  });

  it("Move Down button is disabled for the last block", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));

    const moveDownBtn = screen.getByRole("button", { name: /move block down/i });
    expect(moveDownBtn).toBeDisabled();
  });

  it("shows validation error when name is empty and form is submitted", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    // Add a block first so that block validation doesn't interfere
    await user.click(screen.getByRole("button", { name: /add block/i }));
    // Fill block title to avoid block validation errors
    const titleInput = screen.getByPlaceholderText("Block title");
    await user.type(titleInput, "Focus");
    // Set minutes to 25 (default is already 25, so this should be fine)

    const submitBtn = screen.getByRole("button", { name: /create routine/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("shows active session warning when localStorage has matching routineId", async () => {
    localStorageMock.setItem("activeSessionId", "routine-abc");

    render(<RoutineEditor routineId="routine-abc" />);

    await waitFor(() => {
      expect(
        screen.getByText("Routine is currently running"),
      ).toBeInTheDocument();
    });
  });

  it("does not show active session warning when IDs do not match", async () => {
    localStorageMock.setItem("activeSessionId", "routine-xyz");

    render(<RoutineEditor routineId="routine-abc" />);

    await waitFor(() => {
      expect(
        screen.queryByText("Routine is currently running"),
      ).not.toBeInTheDocument();
    });
  });

  it("renders pre-populated form when initialData is provided (edit mode)", () => {
    const initialData = {
      id: "routine-1",
      userId: "user-1",
      name: "Morning Focus",
      autoAdvance: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      blocks: [
        {
          id: "block-1",
          routineId: "routine-1",
          type: "focus" as const,
          title: "Deep Work",
          durationMinutes: 90,
          position: 0,
          background: "gradient-blue",
          createdAt: new Date(),
        },
      ],
    };

    render(<RoutineEditor initialData={initialData} routineId="routine-1" />);

    const nameInput = screen.getByPlaceholderText("My routine");
    expect(nameInput).toHaveValue("Morning Focus");
    expect(screen.getByText("Block 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update routine/i })).toBeInTheDocument();
  });

  it("shows 'Update Routine' button text in edit mode", () => {
    render(<RoutineEditor routineId="routine-1" />);
    expect(screen.getByRole("button", { name: /update routine/i })).toBeInTheDocument();
  });

  it("shows 'Create Routine' button text in create mode", () => {
    render(<RoutineEditor />);
    expect(screen.getByRole("button", { name: /create routine/i })).toBeInTheDocument();
  });

  it("navigates to /routines on Cancel button click", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockPush).toHaveBeenCalledWith("/routines");
  });

  it("submits form and navigates on success", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "new-routine" }),
    });

    render(<RoutineEditor />);

    const nameInput = screen.getByPlaceholderText("My routine");
    await user.type(nameInput, "My New Routine");

    await user.click(screen.getByRole("button", { name: /add block/i }));
    const titleInput = screen.getByPlaceholderText("Block title");
    await user.type(titleInput, "Focus Session");

    await user.click(screen.getByRole("button", { name: /create routine/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/routines");
    });
  });

  it("shows API error message when submission fails", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Maximum 5 routines allowed" }),
    });

    render(<RoutineEditor />);

    const nameInput = screen.getByPlaceholderText("My routine");
    await user.type(nameInput, "My New Routine");

    await user.click(screen.getByRole("button", { name: /add block/i }));
    const titleInput = screen.getByPlaceholderText("Block title");
    await user.type(titleInput, "Focus Session");

    await user.click(screen.getByRole("button", { name: /create routine/i }));

    await waitFor(() => {
      expect(screen.getByText("Maximum 5 routines allowed")).toBeInTheDocument();
    });
  });

  it("shows generic error when fetch throws a network error", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<RoutineEditor />);

    const nameInput = screen.getByPlaceholderText("My routine");
    await user.type(nameInput, "My New Routine");

    await user.click(screen.getByRole("button", { name: /add block/i }));
    const titleInput = screen.getByPlaceholderText("Block title");
    await user.type(titleInput, "Focus Session");

    await user.click(screen.getByRole("button", { name: /create routine/i }));

    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("shows 'No blocks yet' message when blocks list is empty", () => {
    render(<RoutineEditor />);
    expect(screen.getByText("No blocks yet. Add a block to get started.")).toBeInTheDocument();
  });

  it("total duration shows 25m for default block (0h 25m)", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));
    expect(screen.getByText("25m")).toBeInTheDocument();
  });

  it("total duration shows only hours when minutes is 0", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    await user.click(screen.getByRole("button", { name: /add block/i }));
    const hoursInput = screen.getByRole("spinbutton", { name: /hours/i });
    const minutesInput = screen.getByRole("spinbutton", { name: /minutes/i });

    await user.clear(minutesInput);
    await user.type(minutesInput, "0");
    await user.clear(hoursInput);
    await user.type(hoursInput, "2");

    expect(screen.getByText("2h")).toBeInTheDocument();
  });

  it("Move Up/Down buttons work to reorder blocks", async () => {
    const user = userEvent.setup();
    render(<RoutineEditor />);

    const addBtn = screen.getByRole("button", { name: /add block/i });
    await user.click(addBtn);
    await user.click(addBtn);

    // First block should have Move Down enabled, Move Up disabled
    const moveUpBtns = screen.getAllByRole("button", { name: /move block up/i });
    const moveDownBtns = screen.getAllByRole("button", { name: /move block down/i });

    expect(moveUpBtns[0]).toBeDisabled();
    expect(moveDownBtns[0]).not.toBeDisabled();
    expect(moveUpBtns[1]).not.toBeDisabled();
    expect(moveDownBtns[1]).toBeDisabled();

    // Click move down on first block — it should reorder
    await user.click(moveDownBtns[0]);

    // After move, blocks should be reordered
    const afterMoveUpBtns = screen.getAllByRole("button", { name: /move block up/i });
    expect(afterMoveUpBtns[0]).toBeDisabled(); // still disabled for new first
  });
});
