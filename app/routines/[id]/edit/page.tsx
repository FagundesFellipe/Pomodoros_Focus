"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RoutineWithBlocks } from "@/lib/types/routine";
import RoutineEditor from "@/components/routines/RoutineEditor";

export default function EditRoutinePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [routine, setRoutine] = useState<RoutineWithBlocks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetch(`/api/routines/${id}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? "Failed to load routine.");
        }
        return res.json() as Promise<RoutineWithBlocks>;
      })
      .then((data) => {
        setRoutine(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Failed to load routine.",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-muted-foreground">Loading routine…</p>
      </main>
    );
  }

  if (error || !routine) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-destructive">{error ?? "Routine not found."}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit Routine</h1>
      <RoutineEditor initialData={routine} routineId={id} />
    </main>
  );
}
