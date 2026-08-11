"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, ShieldCheck, Headset, Power, KeyRound, Check, X } from "lucide-react";
import { api } from "@/lib/api";

export type StaffRole = "ADMIN" | "COORDINATOR";

interface StaffMember {
  id: number;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
  isYou: boolean;
}

/** What each role can do, shown to the admin as they pick. */
const ROLES: {
  key: StaffRole; label: string; icon: any; color: string;
  can: string[]; cannot: string[];
}[] = [
  {
    key: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
    color: "#F5841F",
    can: ["Everything a coordinator can do", "Publish available meeting times", "Manage services & subservices", "Create and manage staff accounts"],
    cannot: [],
  },
  {
    key: "COORDINATOR",
    label: "Coordinator",
    icon: Headset,
    color: "#3AADE0",
    can: ["Contact clients", "Approve and reschedule meetings", "Chat with clients"],
    cannot: ["Cannot publish available meeting times", "Cannot manage services", "Cannot manage staff"],
  },
];

export function StaffAccess() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [draft, setDraft] = useState<{ email: string; password: string; role: StaffRole }>({
    email: "", password: "", role: "COORDINATOR",
  });
  const [resetFor, setResetFor] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<{ staff: StaffMember[] }>("/staff");
      setStaff(data.staff);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<unknown>, success?: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await fn();
      await load();
      if (success) setNotice(success);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const create = () =>
    run(async () => {
      await api.post("/staff", draft);
      setDraft({ email: "", password: "", role: "COORDINATOR" });
    }, "Account created. Share the password with them directly — it isn't shown again.");

  const resetPassword = (id: number) =>
    run(async () => {
      await api.put(`/staff/${id}`, { password: newPassword });
      setResetFor(null);
      setNewPassword("");
    }, "Password updated.");

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Access Config</h1>
        <p className="text-gray-500 mt-2 text-lg">Create staff accounts and choose what each person can reach.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">{error}</div>
      )}
      {notice && (
        <div className="mb-6 rounded-2xl bg-[#78BE1F]/10 border border-[#78BE1F]/20 px-5 py-3.5 font-bold text-[#4d7d13]">{notice}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Create */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-6">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-6">New staff account</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="name@harmony.com"
                  autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input
                  value={draft.password}
                  onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300"
                />
                <p className="mt-1.5 text-xs font-medium text-gray-400">
                  You'll need to pass this on to them yourself — it's stored hashed and can't be read back.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Role</label>
                <div className="space-y-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setDraft({ ...draft, role: r.key })}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        draft.role === r.key ? "bg-white" : "border-transparent bg-gray-50 hover:bg-gray-100"
                      }`}
                      style={draft.role === r.key ? { borderColor: r.color } : undefined}
                    >
                      <span className="flex items-center gap-2.5 mb-2">
                        <r.icon className="w-5 h-5" style={{ color: r.color }} />
                        <span className="font-black text-gray-900">{r.label}</span>
                      </span>
                      <ul className="space-y-1">
                        {r.can.map((c) => (
                          <li key={c} className="flex items-start gap-1.5 text-xs font-bold text-gray-500">
                            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#78BE1F]" />{c}
                          </li>
                        ))}
                        {r.cannot.map((c) => (
                          <li key={c} className="flex items-start gap-1.5 text-xs font-bold text-gray-400">
                            <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" />{c}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={create}
                disabled={busy || !draft.email.trim() || draft.password.trim().length < 8}
                className="w-full py-4 rounded-full font-black text-white bg-gray-900 shadow-xl hover:-translate-y-1 transition-all text-lg disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Create account
              </button>
            </div>
          </div>
        </div>

        {/* Existing staff */}
        <div className="flex-1 space-y-4 w-full min-w-0">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            {staff.length} staff account{staff.length === 1 ? "" : "s"}
          </h3>

          {staff.map((member) => {
            const role = ROLES.find((r) => r.key === member.role)!;
            return (
              <div
                key={member.id}
                className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-lg p-6"
                style={{ borderLeft: `6px solid ${role.color}` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-black text-xl text-gray-900 truncate flex items-center gap-2">
                      {member.email}
                      {member.isYou && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-gray-900 text-white">You</span>
                      )}
                      {!member.isActive && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-red-100 text-red-600">Disabled</span>
                      )}
                    </p>
                    <p className="flex items-center gap-1.5 font-bold text-sm mt-1" style={{ color: role.color }}>
                      <role.icon className="w-4 h-4" /> {role.label}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={member.role}
                      disabled={member.isYou}
                      onChange={(e) => run(() => api.put(`/staff/${member.id}`, { role: e.target.value }), "Role updated.")}
                      className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-sm outline-none disabled:opacity-40"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="COORDINATOR">Coordinator</option>
                    </select>

                    <button
                      onClick={() => { setResetFor(resetFor === member.id ? null : member.id); setNewPassword(""); }}
                      title="Set a new password"
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => run(() => api.put(`/staff/${member.id}`, { isActive: !member.isActive }), member.isActive ? "Account disabled." : "Account enabled.")}
                      disabled={member.isYou}
                      title={member.isActive ? "Disable sign-in" : "Enable sign-in"}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 ${
                        member.isActive ? "bg-[#78BE1F]/10 text-[#78BE1F]" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {resetFor === member.id && (
                  <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 characters)"
                      className="flex-1 bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300"
                    />
                    <button
                      onClick={() => resetPassword(member.id)}
                      disabled={newPassword.trim().length < 8 || busy}
                      className="px-6 py-3 rounded-2xl font-black text-white bg-gray-900 disabled:opacity-40 hover:scale-105 transition-transform"
                    >
                      Set password
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
