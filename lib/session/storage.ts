import type { Session } from "@/lib/types/session";

const STORAGE_KEY = "pomodoro-session";
const SCHEMA_VERSION = 1;

export function saveSession(session: Session): void {
  try {
    const data = JSON.stringify({
      ...session,
      schemaVersion: SCHEMA_VERSION,
      _savedAt: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error("Failed to save session to localStorage:", error);
  }
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const data = parsed as Record<string, unknown>;
    if (data.schemaVersion !== SCHEMA_VERSION) {
      console.warn("Session schema version mismatch, clearing session");
      clearSession();
      return null;
    }
    return data as unknown as Session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function detectCorruption(sessionData: unknown): boolean {
  if (typeof sessionData !== "object" || sessionData === null) return true;
  const data = sessionData as Record<string, unknown>;
  const requiredFields: (keyof Session)[] = [
    "snapshot",
    "currentBlockIndex",
    "state",
    "timeRemaining",
    "expectedEndTime",
    "startedAt",
    "isPaused",
    "config",
  ];
  return requiredFields.some((field) => !(field in data));
}
