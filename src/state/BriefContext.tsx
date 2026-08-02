"use client";

import {
  createContext, useContext, useState, useCallback, useMemo, type ReactNode,
} from "react";
import { findModule, SERVICES, type ServiceId } from "@/content/services";

/* The visitor's running selection. Nothing is a purchase — this is the agenda
   they're assembling for a meeting, so it stays deliberately price-free. */

interface BriefState {
  selected: string[];
  has: (moduleId: string) => boolean;
  toggle: (moduleId: string) => void;
  addMany: (moduleIds: string[]) => void;
  removeMany: (moduleIds: string[]) => void;
  clear: () => void;
  count: number;
  /** Services the visitor has touched, in site order. */
  activeServices: ServiceId[];
  countFor: (serviceId: ServiceId) => number;
}

const Ctx = createContext<BriefState | null>(null);

export function BriefProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);

  const has = useCallback(
    (moduleId: string) => selected.includes(moduleId),
    [selected],
  );

  const toggle = useCallback((moduleId: string) => {
    setSelected((prev) =>
      prev.includes(moduleId)
        ? prev.filter((m) => m !== moduleId)
        : [...prev, moduleId],
    );
  }, []);

  const addMany = useCallback((moduleIds: string[]) => {
    setSelected((prev) => Array.from(new Set([...prev, ...moduleIds])));
  }, []);

  const removeMany = useCallback((moduleIds: string[]) => {
    setSelected((prev) => prev.filter((m) => !moduleIds.includes(m)));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const activeServices = useMemo(() => {
    const touched = new Set(
      selected.map((id) => findModule(id)?.serviceId).filter(Boolean),
    );
    // Keep canonical service order rather than click order.
    return SERVICES.filter((s) => touched.has(s.id)).map((s) => s.id);
  }, [selected]);

  const countFor = useCallback(
    (serviceId: ServiceId) =>
      selected.filter((id) => findModule(id)?.serviceId === serviceId).length,
    [selected],
  );

  const value: BriefState = {
    selected, has, toggle, addMany, removeMany, clear,
    count: selected.length,
    activeServices,
    countFor,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrief() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBrief must be used inside <BriefProvider>");
  return ctx;
}
