"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AlertTriangle, Plus } from "lucide-react";

import {
  routineEditorSchema,
  type RoutineEditorValues,
} from "@/lib/validations/routine-editor";
import type { RoutineWithBlocks } from "@/lib/types/routine";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SortableBlockCard } from "./SortableBlockCard";

interface RoutineEditorProps {
  initialData?: RoutineWithBlocks;
  routineId?: string;
}

function formatDuration(totalMinutes: number): string {
  if (totalMinutes === 0) return "0m";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function RoutineEditor({
  initialData,
  routineId,
}: RoutineEditorProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check active session once on mount (routineId doesn't change after mount)
  const [activeSessionWarning] = useState<boolean>(() => {
    if (!routineId || typeof window === "undefined") return false;
    return localStorage.getItem("activeSessionId") === routineId;
  });

  const form = useForm<RoutineEditorValues>({
    resolver: zodResolver(routineEditorSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          autoAdvance: initialData.autoAdvance,
          blocks: initialData.blocks.map((b) => ({
            type: b.type as "focus" | "rest",
            title: b.title,
            hours: Math.floor(b.durationMinutes / 60),
            minutes: b.durationMinutes % 60,
            background: b.background ?? "gradient-purple",
            position: b.position,
          })),
        }
      : {
          name: "",
          autoAdvance: false,
          blocks: [],
        },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "blocks",
  });

  const watchedBlocks = useWatch({ control, name: "blocks" });

  const totalMinutes = (watchedBlocks ?? []).reduce(
    (sum, b) =>
      sum + (Number(b?.hours ?? 0) * 60) + Number(b?.minutes ?? 0),
    0,
  );

  const addBlock = () => {
    if (fields.length >= 50) return;
    append({
      type: "focus",
      title: "",
      hours: 0,
      minutes: 25,
      background: "gradient-purple",
      position: fields.length,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
      setTimeout(() => {
        fields.forEach((_, i) => setValue(`blocks.${i}.position`, i));
      }, 0);
    }
  };

  const onSubmit = async (data: RoutineEditorValues) => {
    setSubmitError(null);

    // Convert hours + minutes to durationMinutes for the API
    const payload = {
      name: data.name,
      autoAdvance: data.autoAdvance,
      blocks: data.blocks.map((b, i) => ({
        type: b.type,
        title: b.title,
        durationMinutes: b.hours * 60 + b.minutes,
        background: b.background,
        position: i,
      })),
    };

    try {
      const url = routineId
        ? `/api/routines/${routineId}`
        : "/api/routines";
      const method = routineId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.error ?? "Failed to save routine.");
        return;
      }

      router.push("/routines");
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
    }
  };

  const counterClass =
    fields.length >= 50
      ? "text-destructive font-medium"
      : fields.length >= 45
        ? "text-amber-500"
        : "text-muted-foreground";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Active session warning */}
        {activeSessionWarning && (
          <Alert className="border-amber-500 bg-amber-50 text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Routine is currently running</AlertTitle>
            <AlertDescription>
              This routine has an active session. Changes will not affect the
              running session until you start a new one.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit error */}
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Routine name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routine Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My routine"
                  maxLength={80}
                  {...field}
                />
              </FormControl>
              <div className="text-right text-xs text-muted-foreground">
                {field.value?.length ?? 0}/80 characters
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Auto-advance toggle */}
        <FormField
          control={control}
          name="autoAdvance"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <FormLabel>Auto-advance to next block</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Automatically starts the next block when the current one ends
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Blocks section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Blocks</h2>
              <span className={counterClass}>
                {fields.length} of 50 blocks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Total Duration:{" "}
                <strong>{formatDuration(totalMinutes)}</strong>
              </p>
              <Button
                type="button"
                onClick={addBlock}
                disabled={fields.length >= 50}
                title={
                  fields.length >= 50
                    ? "Maximum 50 blocks per routine"
                    : undefined
                }
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Block
              </Button>
            </div>
          </div>

          {errors.blocks && !Array.isArray(errors.blocks) && (
            <p className="text-sm text-destructive">
              {errors.blocks.message}
            </p>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <SortableBlockCard
                    key={field.id}
                    id={field.id}
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    isFirst={index === 0}
                    isLast={index === fields.length - 1}
                    onRemove={() => remove(index)}
                    onMoveUp={() => move(index, index - 1)}
                    onMoveDown={() => move(index, index + 1)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {fields.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <p>No blocks yet. Add a block to get started.</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/routines")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving…"
              : routineId
                ? "Update Routine"
                : "Create Routine"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
