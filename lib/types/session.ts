export type SessionState =
  | "idle"
  | "countdown"
  | "running"
  | "paused"
  | "transitioning"
  | "waiting"
  | "completed";

export interface BlockSnapshot {
  readonly id: string;
  readonly type: "focus" | "rest";
  readonly title: string;
  readonly hours: number;
  readonly minutes: number;
  readonly background: string;
  readonly position: number;
}

export interface SessionConfig {
  autoAdvance: boolean;
  soundEnabled: boolean;
}

export interface Session {
  snapshot: readonly BlockSnapshot[];
  currentBlockIndex: number;
  state: SessionState;
  timeRemaining: number; // milliseconds
  expectedEndTime: number; // timestamp ms
  startedAt: number; // timestamp ms
  isPaused: boolean;
  pausedAt?: number; // timestamp ms, set when paused
  config: SessionConfig;
  schemaVersion: number;
}

export interface SessionUpdate {
  state?: SessionState;
  currentBlockIndex?: number;
  timeRemaining?: number;
  expectedEndTime?: number;
  isPaused?: boolean;
  pausedAt?: number;
}

export type SyncMessageType =
  | "SESSION_UPDATED"
  | "STATE_CHANGED"
  | "BLOCK_COMPLETED"
  | "SESSION_CLEARED";

export interface SyncMessage {
  type: SyncMessageType;
  payload: Partial<Session> | null;
  tabId: string;
  timestamp: number;
}
