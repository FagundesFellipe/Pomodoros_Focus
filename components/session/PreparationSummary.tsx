"use client";

import type { BlockSnapshot, SessionConfig } from "@/lib/types/session";
import { formatTotalDuration, snapshotTotalMinutes } from "@/lib/session/prepare";
import { Badge } from "@/components/ui/badge";

interface PreparationSummaryProps {
  name: string;
  snapshot: readonly BlockSnapshot[];
  config: SessionConfig;
}

function blockDurationLabel(block: BlockSnapshot): string {
  const { hours, minutes } = block;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

/**
 * Read-only summary of the routine / Traditional Mode about to be started:
 * name, block count, total duration, settings, and the ordered block list with
 * the first block highlighted (section 10.7.1-10.7.2).
 */
export default function PreparationSummary({
  name,
  snapshot,
  config,
}: PreparationSummaryProps) {
  const totalMinutes = snapshotTotalMinutes(snapshot);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm text-muted-foreground">
          {snapshot.length} {snapshot.length === 1 ? "block" : "blocks"} ·{" "}
          {formatTotalDuration(totalMinutes)} total
        </p>
      </header>

      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <dt className="text-muted-foreground">Auto-advance</dt>
          <dd className="font-medium">{config.autoAdvance ? "On" : "Off"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="text-muted-foreground">Sound</dt>
          <dd className="font-medium">{config.soundEnabled ? "On" : "Off"}</dd>
        </div>
      </dl>

      <ol className="space-y-2">
        {snapshot.map((block, index) => (
          <li
            key={block.id}
            className={
              "flex items-center gap-3 rounded-lg border p-3 " +
              (index === 0 ? "border-primary bg-primary/5" : "border-border")
            }
          >
            <span className="w-6 text-right text-sm tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <Badge variant={block.type === "focus" ? "default" : "secondary"}>
              {block.type === "focus" ? "Focus" : "Rest"}
            </Badge>
            <span className="flex-1 truncate font-medium">{block.title}</span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {blockDurationLabel(block)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
