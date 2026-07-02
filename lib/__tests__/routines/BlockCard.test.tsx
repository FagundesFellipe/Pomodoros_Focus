import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import BlockCard from "@/components/routines/BlockCard";
import {
  routineEditorSchema,
  type RoutineEditorValues,
} from "@/lib/validations/routine-editor";

// ── Wrapper that provides form context ─────────────────────────────────────

interface WrapperProps {
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  index?: number;
}

function BlockCardWrapper({
  onRemove = vi.fn(),
  onMoveUp = vi.fn(),
  onMoveDown = vi.fn(),
  isFirst = false,
  isLast = false,
  index = 0,
}: WrapperProps) {
  const form = useForm<RoutineEditorValues>({
    resolver: zodResolver(routineEditorSchema),
    defaultValues: {
      name: "Test",
      autoAdvance: false,
      blocks: [
        {
          type: "focus",
          title: "",
          hours: 0,
          minutes: 25,
          background: "gradient-purple",
          position: 0,
        },
      ],
    },
  });

  return (
    <Form {...form}>
      <form>
        <BlockCard
          index={index}
          control={form.control}
          register={form.register}
          errors={form.formState.errors}
          onRemove={onRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={isFirst}
          isLast={isLast}
        />
      </form>
    </Form>
  );
}

// ── tests ─────────────────────────────────────────────────────────────────

describe("BlockCard", () => {
  it("renders type select with Focus and Rest options", async () => {
    const user = userEvent.setup();
    render(<BlockCardWrapper />);

    // Open the type select
    const typeSelect = screen.getByRole("combobox", { name: /type/i });
    await user.click(typeSelect);

    expect(screen.getByRole("option", { name: "Focus" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Rest" })).toBeInTheDocument();
  });

  it("renders title input and character counter", async () => {
    const user = userEvent.setup();
    render(<BlockCardWrapper />);

    const titleInput = screen.getByPlaceholderText("Block title");
    expect(titleInput).toBeInTheDocument();
    expect(screen.getByText("0/100")).toBeInTheDocument();

    await user.type(titleInput, "Deep Work");
    expect(screen.getByText("9/100")).toBeInTheDocument();
  });

  it("hours input is present with correct attributes", () => {
    render(<BlockCardWrapper />);

    const hoursInput = screen.getByRole("spinbutton", { name: /hours/i });
    expect(hoursInput).toBeInTheDocument();
    expect(hoursInput).toHaveAttribute("min", "0");
    expect(hoursInput).toHaveAttribute("max", "12");
  });

  it("background selector has all 5 options", async () => {
    const user = userEvent.setup();
    render(<BlockCardWrapper />);

    // Find the background select (last combobox)
    const selects = screen.getAllByRole("combobox");
    const bgSelect = selects[selects.length - 1];

    await user.click(bgSelect);

    expect(screen.getByRole("option", { name: "Purple (Default)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Blue" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Sunset" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "White" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Black" })).toBeInTheDocument();
  });

  it("remove button triggers callback", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<BlockCardWrapper onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: /remove block/i }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("position badge shows correct block number", () => {
    render(<BlockCardWrapper index={2} />);
    expect(screen.getByText("Block 3")).toBeInTheDocument();
  });

  it("move up button is disabled when isFirst is true", () => {
    render(<BlockCardWrapper isFirst />);
    expect(screen.getByRole("button", { name: /move block up/i })).toBeDisabled();
  });

  it("move down button is disabled when isLast is true", () => {
    render(<BlockCardWrapper isLast />);
    expect(screen.getByRole("button", { name: /move block down/i })).toBeDisabled();
  });

  it("move up calls onMoveUp when not first", async () => {
    const user = userEvent.setup();
    const onMoveUp = vi.fn();
    render(<BlockCardWrapper onMoveUp={onMoveUp} isFirst={false} />);

    await user.click(screen.getByRole("button", { name: /move block up/i }));
    expect(onMoveUp).toHaveBeenCalledOnce();
  });
});
