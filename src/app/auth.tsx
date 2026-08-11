"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type SessionUser = {
  id: number;
  email: string;
  role: "ADMIN" | "COORDINATOR" | "COMPANY";
};

/** Staff use the admin portal; companies use the client portal. */
export const isStaffRole = (role?: SessionUser["role"]) =>
  role === "ADMIN" || role === "COORDINATOR";

type LoginResult = { ok: boolean; message?: string; role?: SessionUser["role"] };

type AuthValue = {
  user: SessionUser | null;
  /** True until the first /me check finishes, so guards don't flash. */
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Session state for the app. The JWT itself lives in an httpOnly cookie the
 * browser sends automatically — JavaScript can't read it, so we ask the server
 * who we are instead of trusting anything stored on the client.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = res.ok ? await res.json() : null;
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        return { ok: false, message: data?.message ?? "Unable to sign in. Please try again." };
      }

      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch {
      return { ok: false, message: "Can't reach the server. Is the API running?" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
