"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BlockCard, { type BlockCardProps } from "./BlockCard";

type SortableBlockCardProps = Omit<BlockCardProps, "dragHandleProps"> & {
  id: string;
};

export function SortableBlockCard({ id, ...props }: SortableBlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BlockCard
        {...props}
        dragHandleProps={{ ...attributes, ...listeners } as Record<string, unknown>}
      />
    </div>
  );
}
