"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { BlockSnapshot, Session, SessionConfig } from "@/lib/types/session";
import type { RoutineWithBlocks } from "@/lib/types/routine";
import {
  buildRoutineSnapshot,
  createRunningSession,
  isSessionActive,
} from "@/lib/session/prepare";
import { loadSession, saveSession, clearSession } from "@/lib/session/storage";
import { SessionSyncChannel } from "@/lib/session/sync";

import PreparationSummary from "./PreparationSummary";
import SessionReplacementModal from "./SessionReplacementModal";
import CountdownOverlay from "./CountdownOverlay";
import { Button } from "@/components/ui/button";

interface PreparationData {
  name: string;
  snapshot: readonly BlockSnapshot[];
  config: SessionConfig;
}

/**
 * Session preparation screen. Loads either a saved routine (`?routineId=`) or
 * the temporary Traditional Mode session already staged in localStorage, shows
 * a summary, and — on "Start Session" — runs the 3-2-1 countdown, snapshots the
 * session, and hands off to the timer. Selecting a routine never auto-starts;
 * the countdown only begins on an explicit click (section 10.7).
 */
export default function PreparationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routineId = searchParams.get("routineId");

  const [data, setData] = useState<PreparationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [starting, setStarting] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const syncRef = useRef<SessionSyncChannel | null>(null);
  useEffect(() => {
    syncRef.current = new SessionSyncChannel();
    return () => syncRef.current?.close();
  }, []);

  // ── Load preparation data ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Routine mode: fetch and snapshot the saved routine.
      if (routineId) {
        try {
          const res = await fetch(`/api/routines/${routineId}`);
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error ?? "Failed to load routine.");
          }
          const routine = (await res.json()) as RoutineWithBlocks;
          if (cancelled) return;
          setData({
            name: routine.name,
            snapshot: buildRoutineSnapshot(routine),
            config: {
              autoAdvance: routine.autoAdvance,
              soundEnabled: true,
            },
          });
        } catch (err) {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "Failed to load routine.");
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      // Traditional mode: the form already staged an idle session in storage.
      const staged = loadSession();
      if (cancelled) return;
      if (!staged || staged.snapshot.length === 0) {
        setError("No session to prepare. Start from a routine or Traditional Mode.");
      } else {
        setData({
          name: "Traditional Mode",
          snapshot: staged.snapshot,
          config: staged.config,
        });
      }
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [routineId]);

  // ── Session creation (after countdown completes) ─────────────────────────
  const createSession = useCallback(() => {
    if (!data) return;
    try {
      const session = createRunningSession(data.snapshot, data.config);
      saveSession(session);
      syncRef.current?.postMessage("SESSION_UPDATED", session);
      // replace() so the back button doesn't return to the preparation screen.
      router.replace("/timer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session.");
      setStarting(false);
      setShowCountdown(false);
    }
  }, [data, router]);

  // ── Start button ─────────────────────────────────────────────────────────
  const beginCountdown = useCallback(() => {
    setStarting(true);
    setShowCountdown(true);
  }, []);

  const handleStart = useCallback(() => {
    if (starting || !data) return;
    const existing = loadSession();
    // The staged Traditional session is idle (not active), so it never blocks.
    if (isSessionActive(existing)) {
      setActiveSession(existing);
      return;
    }
    beginCountdown();
  }, [starting, data, beginCountdown]);

  const handleStartNew = useCallback(() => {
    clearSession();
    syncRef.current?.postMessage("SESSION_CLEARED", null);
    setActiveSession(null);
    beginCountdown();
  }, [beginCountdown]);

  const handleKeepCurrent = useCallback(() => {
    setActiveSession(null);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return <p className="text-muted-foreground">Loading session…</p>;
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{error ?? "Session not found."}</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PreparationSummary
        name={data.name}
        snapshot={data.snapshot}
        config={data.config}
      />

      <div className="flex justify-end">
        <Button size="lg" onClick={handleStart} disabled={starting}>
          {starting ? "Starting…" : "Start Session"}
        </Button>
      </div>

      <SessionReplacementModal
        open={activeSession !== null}
        activeBlockTitle={
          activeSession?.snapshot[activeSession.currentBlockIndex]?.title ??
          "in progress"
        }
        onKeepCurrent={handleKeepCurrent}
        onStartNew={handleStartNew}
      />

      {showCountdown && <CountdownOverlay onComplete={createSession} />}
    </div>
  );
}
