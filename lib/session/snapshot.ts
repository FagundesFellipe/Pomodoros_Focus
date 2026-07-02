import type { BlockSnapshot } from "@/lib/types/session";

// The Routine type from the API response
interface RoutineBlock {
  id?: string;
  type: "focus" | "rest";
  title: string;
  hours: number;
  minutes: number;
  background?: string;
  position: number;
}

interface Routine {
  id: string;
  blocks: RoutineBlock[];
}

export function createSessionSnapshot(routine: Routine): readonly BlockSnapshot[] {
  const snapshot: BlockSnapshot[] = routine.blocks.map((block, index) =>
    Object.freeze({
      id: block.id ?? `block-${index}`,
      type: block.type,
      title: block.title,
      hours: block.hours,
      minutes: block.minutes,
      background: block.background ?? "gradient-purple",
      position: block.position,
    })
  );
  return Object.freeze(snapshot);
}

export function isSnapshotValid(snapshot: unknown): snapshot is readonly BlockSnapshot[] {
  if (!Array.isArray(snapshot) || snapshot.length === 0) return false;
  return snapshot.every(
    (block) =>
      typeof block === "object" &&
      block !== null &&
      typeof (block as BlockSnapshot).id === "string" &&
      ((block as BlockSnapshot).type === "focus" || (block as BlockSnapshot).type === "rest") &&
      typeof (block as BlockSnapshot).title === "string" &&
      typeof (block as BlockSnapshot).hours === "number" &&
      typeof (block as BlockSnapshot).minutes === "number"
  );
}
