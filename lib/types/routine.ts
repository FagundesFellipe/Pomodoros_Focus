import type { Routine, NewRoutine } from "@/lib/db/schema/routines";
import type { Block, NewBlock } from "@/lib/db/schema/blocks";
import type { CreateRoutineInput, UpdateRoutineInput } from "@/lib/validations/routine";

export type { Routine, NewRoutine, Block, NewBlock };

export type RoutineWithBlocks = Routine & { blocks: Block[] };

export type RoutineListItem = Routine & { blockCount: number };

export type RoutineListResponse = RoutineListItem[];

export type RoutineDetailResponse = RoutineWithBlocks;

export type CreateRoutineRequest = CreateRoutineInput;

export type UpdateRoutineRequest = UpdateRoutineInput;
