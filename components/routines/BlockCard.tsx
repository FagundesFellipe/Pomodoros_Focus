"use client";

import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import {
  ChevronUp,
  ChevronDown,
  GripVertical,
  Trash2,
} from "lucide-react";

import type { RoutineEditorValues } from "@/lib/validations/routine-editor";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BACKGROUND_OPTIONS = [
  { value: "gradient-purple", label: "Purple (Default)" },
  { value: "gradient-blue", label: "Blue" },
  { value: "gradient-sunset", label: "Sunset" },
  { value: "solid-white", label: "White" },
  { value: "solid-black", label: "Black" },
] as const;

export interface BlockCardProps {
  index: number;
  control: Control<RoutineEditorValues>;
  register: UseFormRegister<RoutineEditorValues>;
  errors: FieldErrors<RoutineEditorValues>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export default function BlockCard({
  index,
  control,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  dragHandleProps,
}: BlockCardProps) {
  const blockErrors = errors.blocks?.[index];

  return (
    <Card className="relative">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            type="button"
            aria-label="Drag to reorder"
            className="mt-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...(dragHandleProps ?? {})}
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex-1 space-y-3">
            {/* Header row: position badge + move buttons + remove */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Block {index + 1}
              </Badge>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move block up"
                  disabled={isFirst}
                  onClick={onMoveUp}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move block down"
                  disabled={isLast}
                  onClick={onMoveDown}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove block"
                  onClick={onRemove}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Type select */}
            <FormField
              control={control}
              name={`blocks.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="rest">Rest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title input */}
            <FormField
              control={control}
              name={`blocks.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Block title"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-right text-xs text-muted-foreground">
                    {field.value?.length ?? 0}/100
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration row: hours + minutes */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                name={`blocks.${index}.hours`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={12}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`blocks.${index}.minutes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    {blockErrors?.minutes && (
                      <p className="text-sm text-destructive">
                        {blockErrors.minutes.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Background select */}
            <FormField
              control={control}
              name={`blocks.${index}.background`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BACKGROUND_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
