"use client";

import RoutineEditor from "@/components/routines/RoutineEditor";

export default function NewRoutinePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Create New Routine</h1>
      <RoutineEditor />
    </main>
  );
}
