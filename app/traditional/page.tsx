"use client";

import TraditionalForm from "@/components/traditional/TraditionalForm";

export default function TraditionalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Traditional Mode</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Set a focus and rest duration and the number of cycles. We&apos;ll
        generate an alternating sequence — no routine saved.
      </p>
      <TraditionalForm />
    </main>
  );
}
