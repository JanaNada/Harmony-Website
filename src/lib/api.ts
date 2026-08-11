import type { ServiceId } from "@/content/services";

/** The public site's service ids vs the enum the database stores. */
export const SERVICE_TYPE_BY_ID: Record<ServiceId, string> = {
  business: "MANAGEMENT",
  events: "EVENTS",
  marketing: "MARKETING",
  recruitment: "RECRUITMENT",
  technology: "TECHNOLOGY",
};

export const SERVICE_LABEL: Record<string, string> = {
  MANAGEMENT: "Business Development",
  EVENTS: "Events & Catering",
  MARKETING: "Marketing",
  RECRUITMENT: "Recruitment",
  TECHNOLOGY: "F&B Technology",
  FNB: "Food & Beverage",
  CATERING: "Catering",
  OTHER: "Other",
};

export const SERVICE_COLOR: Record<string, string> = {
  MANAGEMENT: "#F5841F",
  EVENTS: "#E91E8C",
  MARKETING: "#3AADE0",
  RECRUITMENT: "#78BE1F",
  TECHNOLOGY: "#7C5CFF",
  FNB: "#F5841F",
  CATERING: "#E91E8C",
  OTHER: "#8A8A8A",
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || data?.success === false) {
    throw new ApiError(data?.message ?? `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ─── Shapes returned by the API ─────────────────────────────────────────────

export type SlotStatus = "OPEN" | "REQUESTED" | "BOOKED" | "CLOSED";

export interface Slot {
  id: number;
  startsAt: string;
  endsAt: string;
  status: SlotStatus;
  services: string[];
  requestId: number | null;
  requestTitle: string | null;
  companyId: number | null;
  companyName: string | null;
}

export interface PendingRequest {
  id: number;
  title: string;
  serviceType: string;
  status: string;
  createdAt: string;
  meetingAt: string | null;
  companyId: number;
  companyName: string;
  contactName: string;
  contactPhone: string | null;
  email: string;
}

export interface CompanyProfile {
  company: {
    id: number;
    companyName: string;
    contactName: string;
    contactPhone: string | null;
    email: string;
    isActive: boolean;
    createdAt: string;
  };
  requests: {
    id: number;
    title: string;
    description: string;
    serviceType: string;
    status: string;
    budgetRange: string | null;
    location: string | null;
    createdAt: string;
    slotId: number | null;
    meetingAt: string | null;
    meetingEndsAt: string | null;
  }[];
  reschedules: {
    id: number;
    requestId: number;
    status: string;
    message: string | null;
    proposedAt: string;
    createdAt: string;
  }[];
}

export interface ChatMessage {
  id: number;
  body: string;
  createdAt: string;
  senderUserId: number;
  senderRole: "ADMIN" | "COMPANY";
  senderEmail: string;
  mine: boolean;
}

export interface RescheduleRequest {
  id: number;
  requestId: number;
  title: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  message: string | null;
  proposedAt: string;
  currentAt: string | null;
  createdAt: string;
}

// ─── Formatting helpers ─────────────────────────────────────────────────────

export const formatDateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        weekday: "short", day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
      })
    : "No time set";

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
