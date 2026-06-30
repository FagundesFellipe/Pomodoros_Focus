export function getCurrentTimestamp(): number {
  return Date.now();
}

export function calculateTimeRemaining(
  expectedEndTime: number,
  now: number = getCurrentTimestamp()
): number {
  return Math.max(0, expectedEndTime - now);
}

export function calculateExpectedEndTime(startTime: number, durationMs: number): number {
  return startTime + durationMs;
}

export function blockDurationMs(hours: number, minutes: number): number {
  return (hours * 60 + minutes) * 60 * 1000;
}

export function isBlockComplete(timeRemaining: number): boolean {
  return timeRemaining <= 0;
}

export function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
