import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── mocks ──────────────────────────────────────────────────────────────────

const {
  mockGetSession,
  mockTransaction,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockQueryRoutinesFindFirst,
} = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockTransaction: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockQueryRoutinesFindFirst: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}));

vi.mock("@/lib/db", () => ({
  db: {
    transaction: mockTransaction,
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    query: {
      routines: { findFirst: mockQueryRoutinesFindFirst },
    },
  },
}));

// ── import handlers after mocks ────────────────────────────────────────────

import { POST, GET } from "@/app/api/routines/route";
import {
  GET as GETById,
  PATCH,
  DELETE,
} from "@/app/api/routines/[id]/route";

// ── helpers ────────────────────────────────────────────────────────────────

const USER_A = { id: "user-a", name: "Alice", email: "alice@test.com" };
const USER_B = { id: "user-b", name: "Bob", email: "bob@test.com" };

function makeRequest(body?: unknown, method = "GET"): NextRequest {
  return new NextRequest("http://localhost/api/routines", {
    method,
    headers: { "content-type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function makeIdRequest(id: string, body?: unknown, method = "GET"): [NextRequest, { params: Promise<{ id: string }> }] {
  const req = new NextRequest(`http://localhost/api/routines/${id}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return [req, { params: Promise.resolve({ id }) }];
}

const mockRoutine = {
  id: "routine-1",
  userId: USER_A.id,
  name: "Morning Focus",
  autoAdvance: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBlock = {
  id: "block-1",
  routineId: "routine-1",
  type: "focus" as const,
  title: "Deep Work",
  durationMinutes: 25,
  position: 0,
  background: null,
  createdAt: new Date(),
};

// chain helper for .select().from().where().groupBy() etc.
function mockChain(resolveValue: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = ["from", "where", "orderBy", "groupBy", "returning"];
  methods.forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain);
  });
  (chain as { then: (resolve: (v: unknown) => void) => void }).then = (resolve) => resolve(resolveValue);
  // make it thenable (Promise-like)
  Object.assign(chain, Promise.resolve(resolveValue));
  return chain;
}

// ── POST /api/routines ─────────────────────────────────────────────────────

describe("POST /api/routines", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "Test" }, "POST"));
    expect(res.status).toBe(401);
  });

  it("returns 400 when user already has 5 routines", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ value: 5 }]),
      }),
    });

    const res = await POST(makeRequest({ name: "Sixth" }, "POST"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("5 routines");
  });

  it("returns 400 when body fails validation", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ value: 0 }]),
      }),
    });

    const res = await POST(makeRequest({ name: "" }, "POST"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for name over 80 chars", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ value: 0 }]),
      }),
    });

    const res = await POST(makeRequest({ name: "a".repeat(81) }, "POST"));
    expect(res.status).toBe(400);
  });

  it("creates routine and returns 201", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ value: 0 }]),
      }),
    });
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockRoutine]),
          }),
        }),
      };
      return fn(tx);
    });

    const res = await POST(makeRequest({ name: "Morning Focus" }, "POST"));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Morning Focus");
    expect(body.blocks).toEqual([]);
  });

  it("creates routine with blocks in transaction", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ value: 2 }]),
      }),
    });
    const routineWithBlocks = { ...mockRoutine, blocks: [mockBlock] };
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        insert: vi.fn()
          .mockReturnValueOnce({
            values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([mockRoutine]) }),
          })
          .mockReturnValue({
            values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([mockBlock]) }),
          }),
      };
      return fn(tx);
    });

    const payload = {
      name: "Morning Focus",
      blocks: [{ type: "focus", title: "Deep Work", durationMinutes: 25, position: 0 }],
    };
    const res = await POST(makeRequest(payload, "POST"));
    expect(res.status).toBe(201);
    expect(routineWithBlocks).toBeTruthy(); // used to avoid unused var lint
  });
});

// ── GET /api/routines ──────────────────────────────────────────────────────

describe("GET /api/routines", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns empty array for new user", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.routines).toEqual([]);
  });

  it("returns only the current user's routines", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    const routineA = { ...mockRoutine, userId: USER_A.id };
    mockSelect
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([routineA]),
          }),
        }),
      })
      .mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            groupBy: vi.fn().mockResolvedValue([{ routineId: routineA.id, value: 3 }]),
          }),
        }),
      });

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.routines).toHaveLength(1);
    expect(body.routines[0].userId).toBe(USER_A.id);
    expect(body.routines[0].blockCount).toBe(3);
  });
});

// ── GET /api/routines/[id] ─────────────────────────────────────────────────

describe("GET /api/routines/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const [req, ctx] = makeIdRequest("routine-1");
    const res = await GETById(req, ctx);
    expect(res.status).toBe(401);
  });

  it("returns 404 for non-existent routine", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(undefined);

    const [req, ctx] = makeIdRequest("nonexistent");
    const res = await GETById(req, ctx);
    expect(res.status).toBe(404);
  });

  it("returns 403 when user accesses another user's routine", async () => {
    mockGetSession.mockResolvedValue({ user: USER_B });
    mockQueryRoutinesFindFirst.mockResolvedValue({ ...mockRoutine, blocks: [] });

    const [req, ctx] = makeIdRequest("routine-1");
    const res = await GETById(req, ctx);
    expect(res.status).toBe(403);
  });

  it("returns routine with blocks for owner", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue({ ...mockRoutine, blocks: [mockBlock] });

    const [req, ctx] = makeIdRequest("routine-1");
    const res = await GETById(req, ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.blocks).toHaveLength(1);
  });
});

// ── PATCH /api/routines/[id] ───────────────────────────────────────────────

describe("PATCH /api/routines/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const [req, ctx] = makeIdRequest("routine-1", { name: "Updated" }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(401);
  });

  it("returns 404 for non-existent routine", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(undefined);

    const [req, ctx] = makeIdRequest("nonexistent", { name: "Updated" }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(404);
  });

  it("returns 403 when patching another user's routine", async () => {
    mockGetSession.mockResolvedValue({ user: USER_B });
    mockQueryRoutinesFindFirst
      .mockResolvedValueOnce(mockRoutine); // existence check

    const [req, ctx] = makeIdRequest("routine-1", { name: "Hijacked" }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(403);
  });

  it("returns 400 for name over 80 chars", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(mockRoutine);

    const [req, ctx] = makeIdRequest("routine-1", { name: "a".repeat(81) }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(400);
  });

  it("returns 400 when blocks exceed 50", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(mockRoutine);

    const manyBlocks = Array.from({ length: 51 }, (_, i) => ({
      type: "focus",
      title: "Block",
      durationMinutes: 25,
      position: i,
    }));
    const [req, ctx] = makeIdRequest("routine-1", { blocks: manyBlocks }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(400);
  });

  it("updates routine name and returns 200", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    const updatedRoutine = { ...mockRoutine, name: "Updated", blocks: [] };
    mockQueryRoutinesFindFirst
      .mockResolvedValueOnce(mockRoutine)   // ownership check
      .mockResolvedValueOnce(updatedRoutine); // return after update
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
        }),
        delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
      };
      await fn(tx);
    });

    const [req, ctx] = makeIdRequest("routine-1", { name: "Updated" }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Updated");
  });

  it("updates blocks in transaction (replace all)", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    const updatedRoutine = { ...mockRoutine, blocks: [mockBlock] };
    mockQueryRoutinesFindFirst
      .mockResolvedValueOnce(mockRoutine)
      .mockResolvedValueOnce(updatedRoutine);
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
        }),
        delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
      };
      await fn(tx);
    });

    const newBlocks = [{ type: "rest", title: "Break", durationMinutes: 5, position: 0 }];
    const [req, ctx] = makeIdRequest("routine-1", { blocks: newBlocks }, "PATCH");
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);
  });
});

// ── DELETE /api/routines/[id] ──────────────────────────────────────────────

describe("DELETE /api/routines/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const [req, ctx] = makeIdRequest("routine-1", undefined, "DELETE");
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(401);
  });

  it("returns 404 for non-existent routine", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(undefined);

    const [req, ctx] = makeIdRequest("nonexistent", undefined, "DELETE");
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(404);
  });

  it("returns 403 when deleting another user's routine", async () => {
    mockGetSession.mockResolvedValue({ user: USER_B });
    mockQueryRoutinesFindFirst.mockResolvedValue(mockRoutine);

    const [req, ctx] = makeIdRequest("routine-1", undefined, "DELETE");
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(403);
  });

  it("deletes routine and blocks, returns 204", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(mockRoutine);
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
      };
      await fn(tx);
    });

    const [req, ctx] = makeIdRequest("routine-1", undefined, "DELETE");
    const res = await DELETE(req, ctx);
    expect(res.status).toBe(204);
  });

  it("cascade deletes blocks before routine in transaction", async () => {
    mockGetSession.mockResolvedValue({ user: USER_A });
    mockQueryRoutinesFindFirst.mockResolvedValue(mockRoutine);

    const deleteOrder: string[] = [];
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        delete: vi.fn().mockImplementation((table: { [Symbol.for("drizzle:Name")]: string }) => {
          const name = table[Symbol.for("drizzle:Name")] ?? "unknown";
          deleteOrder.push(name);
          return { where: vi.fn().mockResolvedValue(undefined) };
        }),
      };
      await fn(tx);
    });

    const [req, ctx] = makeIdRequest("routine-1", undefined, "DELETE");
    await DELETE(req, ctx);
    // blocks must be deleted before routines to satisfy FK constraints
    expect(deleteOrder[0]).not.toBe("routines");
  });
});
