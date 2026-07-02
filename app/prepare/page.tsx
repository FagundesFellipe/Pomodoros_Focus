import { Suspense } from "react";
import PreparationScreen from "@/components/session/PreparationScreen";

export default function PreparePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Suspense
        fallback={<p className="text-muted-foreground">Loading session…</p>}
      >
        <PreparationScreen />
      </Suspense>
    </main>
  );
}
