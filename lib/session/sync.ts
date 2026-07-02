import type { Session, SyncMessage, SyncMessageType } from "@/lib/types/session";

const CHANNEL_NAME = "pomodoro-session-sync";
const TAB_ID =
  typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36);

type MessageHandler = (message: SyncMessage) => void;

export class SessionSyncChannel {
  private channel: BroadcastChannel | null = null;
  private handlers: MessageHandler[] = [];
  private lastSentAt = 0;
  private readonly throttleMs = 100;

  constructor() {
    if (typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        // Ignore own messages
        if (event.data.tabId === TAB_ID) return;
        this.handlers.forEach((h) => h(event.data));
      };
    }
  }

  postMessage(type: SyncMessageType, payload: Partial<Session> | null = null): void {
    if (!this.channel) return;
    const now = Date.now();
    if (now - this.lastSentAt < this.throttleMs) return; // throttle
    this.lastSentAt = now;

    const message: SyncMessage = { type, payload, tabId: TAB_ID, timestamp: now };
    this.channel.postMessage(message);
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  close(): void {
    this.channel?.close();
    this.channel = null;
    this.handlers = [];
  }
}

export { TAB_ID };
