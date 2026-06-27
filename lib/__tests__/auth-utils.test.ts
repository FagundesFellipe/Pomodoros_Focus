import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers()),
}));

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

import { getServerSession, getCurrentUser, requireAuth } from "@/lib/auth-utils";
import { auth } from "@/lib/auth";

describe("auth-utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getServerSession", () => {
    it("returns session when authenticated", async () => {
      const mockSession = {
        user: { id: "1", name: "Test", email: "test@test.com" },
        session: {},
      };
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);

      const result = await getServerSession();
      expect(result).toEqual(mockSession);
    });

    it("returns null when not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as never);

      const result = await getServerSession();
      expect(result).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("returns user when session exists", async () => {
      const mockUser = { id: "1", name: "Test", email: "test@test.com" };
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: mockUser,
        session: {},
      } as never);

      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it("returns null when no session", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as never);

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe("requireAuth", () => {
    it("returns session when authenticated", async () => {
      const mockSession = {
        user: { id: "1", name: "Test", email: "test@test.com" },
        session: {},
      };
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);

      const result = await requireAuth();
      expect(result).toEqual(mockSession);
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("redirects to /login when not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as never);

      await requireAuth();
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
  });
});
