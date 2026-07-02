"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  traditionalSchema,
  type TraditionalValues,
  MAX_CYCLES,
} from "@/lib/validations/traditional";
import { createTraditionalSession } from "@/lib/session/traditional";
import { saveSession } from "@/lib/session/storage";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

const defaultValues: TraditionalValues = {
  focusHours: 0,
  focusMinutes: 25,
  restHours: 0,
  restMinutes: 5,
  cycles: 4,
  autoAdvance: false,
};

function numberChange(onChange: (value: number) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    onChange(Number.isNaN(value) ? 0 : value);
  };
}

export default function TraditionalForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<TraditionalValues>({
    resolver: zodResolver(traditionalSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const cycles = useWatch({ control, name: "cycles" });
  const safeCycles =
    Number.isFinite(cycles) && cycles >= 1 && cycles <= MAX_CYCLES
      ? Math.floor(cycles)
      : 0;
  const blockCount = safeCycles * 2;

  // Preview sequence: "Focus 1", "Rest 1", ... (section 10.6.6)
  const previewSequence: string[] = [];
  for (let i = 0; i < safeCycles; i++) {
    previewSequence.push(`Focus ${i + 1}`, `Rest ${i + 1}`);
  }

  const onSubmit = (data: TraditionalValues) => {
    setSubmitError(null);
    try {
      const session = createTraditionalSession({
        focusDurationMinutes: data.focusHours * 60 + data.focusMinutes,
        restDurationMinutes: data.restHours * 60 + data.restMinutes,
        cycles: data.cycles,
        config: { autoAdvance: data.autoAdvance, soundEnabled: true },
      });

      // Temporary session — not saved to the routines table, so it never
      // occupies one of the 5 routine slots (section 10.6.7).
      saveSession(session);
      if (typeof window !== "undefined") {
        localStorage.setItem("activeSessionId", "traditional");
      }

      // Hand off to the preparation screen (Task 8).
      router.push("/prepare");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to start Traditional Mode.",
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Focus duration */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Focus Duration</legend>
          <div className="flex gap-3">
            <FormField
              control={control}
              name="focusHours"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={12}
                      {...field}
                      onChange={numberChange(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="focusMinutes"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      {...field}
                      onChange={numberChange(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Rest duration */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Rest Duration</legend>
          <div className="flex gap-3">
            <FormField
              control={control}
              name="restHours"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={12}
                      {...field}
                      onChange={numberChange(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="restMinutes"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      {...field}
                      onChange={numberChange(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Cycles */}
        <FormField
          control={control}
          name="cycles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Cycles</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={MAX_CYCLES}
                  {...field}
                  onChange={numberChange(field.onChange)}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Max {MAX_CYCLES} cycles ({MAX_CYCLES * 2} blocks)
              </p>
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

        {/* Sequence preview (section 10.6.5 / 10.6.7) */}
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">
            {safeCycles > 0 ? (
              <>
                {safeCycles} {safeCycles === 1 ? "cycle" : "cycles"} will
                generate {blockCount} blocks
              </>
            ) : (
              "Enter a valid number of cycles to preview the sequence"
            )}
          </p>
          {previewSequence.length > 0 && (
            <ol className="mt-3 flex flex-wrap gap-2">
              {previewSequence.map((label, i) => (
                <li
                  key={i}
                  className={
                    "rounded-md px-2 py-1 text-xs " +
                    (label.startsWith("Focus")
                      ? "bg-purple-100 text-purple-900"
                      : "bg-blue-100 text-blue-900")
                  }
                >
                  {label}
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Starting…" : "Start Session"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
