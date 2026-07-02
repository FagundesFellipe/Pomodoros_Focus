import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock BroadcastChannel before importing the module
class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];
  onmessage: ((event: { data: unknown }) => void) | null = null;

  constructor(public name: string) {
    MockBroadcastChannel.instances.push(this);
  }

  postMessage(data: unknown) {
    MockBroadcastChannel.instances
      .filter((c) => c !== this && c.name === this.name)
      .forEach((c) => c.onmessage?.({ data }));
  }

  close() {
    MockBroadcastChannel.instances = MockBroadcastChannel.instances.filter((c) => c !== this);
  }
}

vi.stubGlobal("BroadcastChannel", MockBroadcastChannel);

// Import after stub
import { SessionSyncChannel } from "@/lib/session/sync";

describe("SessionSyncChannel", () => {
  beforeEach(() => {
    MockBroadcastChannel.instances = [];
  });

  it("registers a BroadcastChannel on construction", () => {
    new SessionSyncChannel();
    expect(MockBroadcastChannel.instances).toHaveLength(1);
  });

  it("onMessage handler fires when message received from another channel", () => {
    const channelA = new SessionSyncChannel();
    const channelB = new SessionSyncChannel();

    const received: unknown[] = [];
    channelB.onMessage((msg) => received.push(msg));

    // Patch channelA's tabId to be different from B's
    // We force post directly via mock
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _mockA = MockBroadcastChannel.instances[0];
    const mockB = MockBroadcastChannel.instances[1];

    // Simulate channel A posting a raw message to channel B
    mockB.onmessage?.({
      data: {
        type: "SESSION_UPDATED",
        payload: null,
        tabId: "some-other-tab",
        timestamp: Date.now(),
      },
    });

    expect(received).toHaveLength(1);

    channelA.close();
    channelB.close();
  });

  it("handler unsubscribe works", () => {
    const channel = new SessionSyncChannel();
    const received: unknown[] = [];
    const unsubscribe = channel.onMessage((msg) => received.push(msg));

    unsubscribe();

    const mock = MockBroadcastChannel.instances[0];
    mock.onmessage?.({
      data: { type: "SESSION_UPDATED", payload: null, tabId: "other", timestamp: Date.now() },
    });

    expect(received).toHaveLength(0);
    channel.close();
  });

  it("close() cleans up handlers", () => {
    const channel = new SessionSyncChannel();
    const received: unknown[] = [];
    channel.onMessage((msg) => received.push(msg));

    channel.close();

    // After close, instances should be empty
    expect(MockBroadcastChannel.instances).toHaveLength(0);
  });

  it("postMessage does not throw when called", () => {
    const channel = new SessionSyncChannel();
    expect(() => channel.postMessage("SESSION_UPDATED", null)).not.toThrow();
    channel.close();
  });

  it("throttle prevents rapid re-sends within 100ms", () => {
    const channel = new SessionSyncChannel();
    const mock = MockBroadcastChannel.instances[0];

    const sentMessages: unknown[] = [];
    const originalPost = mock.postMessage.bind(mock);
    mock.postMessage = (data: unknown) => {
      sentMessages.push(data);
      originalPost(data);
    };

    // Send multiple messages rapidly
    channel.postMessage("SESSION_UPDATED", null);
    channel.postMessage("SESSION_UPDATED", null);
    channel.postMessage("STATE_CHANGED", null);

    // Only the first should be sent due to throttle
    expect(sentMessages).toHaveLength(1);

    channel.close();
  });

  it("postMessage sends after throttle window elapses", async () => {
    vi.useFakeTimers();

    const channel = new SessionSyncChannel();
    const mock = MockBroadcastChannel.instances[0];

    const sentMessages: unknown[] = [];
    const originalPost = mock.postMessage.bind(mock);
    mock.postMessage = (data: unknown) => {
      sentMessages.push(data);
      originalPost(data);
    };

    channel.postMessage("SESSION_UPDATED", null);
    expect(sentMessages).toHaveLength(1);

    // Advance time past throttle window
    vi.advanceTimersByTime(150);

    channel.postMessage("STATE_CHANGED", null);
    expect(sentMessages).toHaveLength(2);

    channel.close();
    vi.useRealTimers();
  });
});
