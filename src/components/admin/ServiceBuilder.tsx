"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Check, X, ChevronDown, ChevronRight, Power, Palette } from "lucide-react";
import { api } from "@/lib/api";
import { ImagePicker } from "./ImagePicker";

export interface Subservice {
  id: number;
  serviceId: number;
  title: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CatalogService {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  sortOrder: number;
  isActive: boolean;
  subservices: Subservice[];
}

/** The palette the rest of the site already uses, plus room for new ones. */
const PRESET_COLORS = [
  "#F5841F", "#E91E8C", "#3AADE0", "#78BE1F",
  "#7C5CFF", "#00B8A9", "#D7263D", "#1A1A1A",
];

const EMPTY_DRAFT = {
  title: "", tagline: "", description: "",
  accentColor: PRESET_COLORS[0], imageUrl: null as string | null,
};

const EMPTY_SUB_DRAFT = {
  title: "", shortDescription: "", description: "", imageUrl: null as string | null,
};

/**
 * Create and manage the services offered, each with its own accent colour and
 * its list of subservices.
 */
export function ServiceBuilder() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [subDraft, setSubDraft] = useState(EMPTY_SUB_DRAFT);

  const load = useCallback(async () => {
    try {
      const data = await api.get<{ services: CatalogService[] }>("/catalog");
      setServices(data.services);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      await load();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const createService = () =>
    run(async () => {
      await api.post("/catalog/services", draft);
      setDraft(EMPTY_DRAFT);
    });

  const addSubservice = (serviceId: number) =>
    run(async () => {
      await api.post(`/catalog/services/${serviceId}/subservices`, subDraft);
      setSubDraft(EMPTY_SUB_DRAFT);
    });

  return (
    <div className="animate-in fade-in duration-700 w-full">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Service Architect</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Add a service, pick the colour its page uses, and build up its subservices.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Create */}
        <div className="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: `${draft.accentColor}18`, color: draft.accentColor }}
            >
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-6">New service</h3>

            <div className="space-y-5">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Service name"
                className="w-full border-b-2 border-gray-200 px-1 py-3 text-lg font-bold text-gray-900 outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300"
              />
              <input
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                placeholder="Tagline (one line)"
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300"
              />
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="What this service covers"
                rows={3}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 resize-none placeholder-gray-300"
              />

              <ImagePicker
                value={draft.imageUrl}
                /* Functional update: the upload finishes after the click that
                   started it, and the user may have carried on typing in the
                   meantime. Merging into the latest draft avoids clobbering
                   whatever they typed while it was uploading. */
                onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))}
                label="Service image"
              />

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  <Palette className="w-4 h-4" /> Page colour
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraft({ ...draft, accentColor: c })}
                      aria-label={`Use ${c}`}
                      className={`w-9 h-9 rounded-xl transition-all ${
                        draft.accentColor === c ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-110"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                  <label className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                    <input
                      type="color"
                      value={draft.accentColor}
                      onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })}
                      className="opacity-0 w-0 h-0"
                    />
                    <Plus className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              <button
                onClick={createService}
                disabled={!draft.title.trim() || busy}
                className="w-full py-4 rounded-full font-black text-white shadow-xl hover:-translate-y-1 transition-all text-lg disabled:opacity-40 disabled:hover:translate-y-0"
                style={{ background: draft.accentColor }}
              >
                Create service
              </button>
            </div>
          </div>
        </div>

        {/* Existing */}
        <div className="flex-1 space-y-5 w-full min-w-0">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            {services.length} service{services.length === 1 ? "" : "s"}
          </h3>

          {services.length === 0 && (
            <div className="bg-white/50 rounded-[2rem] p-12 text-center border border-white">
              <p className="text-gray-500 font-bold">No services yet.</p>
            </div>
          )}

          {services.map((s) => {
            const color = s.accentColor ?? "#8A8A8A";
            const open = expanded === s.id;

            return (
              <div
                key={s.id}
                className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-lg overflow-hidden"
                style={{ borderLeft: `6px solid ${color}` }}
              >
                <div className="p-6 flex items-start justify-between gap-4">
                  <button
                    onClick={() => setExpanded(open ? null : s.id)}
                    className="flex items-start gap-3 text-left min-w-0 flex-1"
                  >
                    {open ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    )}
                    <span className="min-w-0">
                      <span className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-2xl font-black text-gray-900">{s.title}</span>
                        {!s.isActive && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-gray-200 text-gray-500">
                            Hidden
                          </span>
                        )}
                      </span>
                      {s.tagline && <span className="block text-gray-500 font-bold">{s.tagline}</span>}
                      <span className="block text-xs font-bold text-gray-400 mt-1">
                        {s.subservices.length} subservice{s.subservices.length === 1 ? "" : "s"}
                      </span>
                    </span>
                  </button>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) =>
                        run(() => api.put(`/catalog/services/${s.id}`, { accentColor: e.target.value }))
                      }
                      title="Change page colour"
                      className="w-9 h-9 rounded-xl border-0 cursor-pointer bg-transparent p-0"
                    />
                    <button
                      onClick={() => run(() => api.put(`/catalog/services/${s.id}`, { isActive: !s.isActive }))}
                      title={s.isActive ? "Hide from site" : "Show on site"}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        s.isActive ? "bg-[#78BE1F]/10 text-[#78BE1F]" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => run(() => api.del(`/catalog/services/${s.id}`))}
                      title="Delete service"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                    <div className="space-y-2.5 mb-5">
                      {s.subservices.length === 0 && (
                        <p className="text-sm font-bold text-gray-400">No subservices yet.</p>
                      )}
                      {s.subservices.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {sub.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={sub.imageUrl}
                                alt={sub.title}
                                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-gray-200/60 flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-black text-gray-900">{sub.title}</p>
                              {sub.shortDescription && (
                                <p className="text-sm font-medium text-gray-500">{sub.shortDescription}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => run(() => api.del(`/catalog/subservices/${sub.id}`))}
                            className="text-gray-300 hover:text-red-600 transition-colors flex-shrink-0"
                            aria-label={`Remove ${sub.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-3">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Add a subservice</p>

                      <div className="flex gap-3 items-start">
                        <ImagePicker
                          value={subDraft.imageUrl}
                          onChange={(url) => setSubDraft((d) => ({ ...d, imageUrl: url }))}
                          compact
                        />
                        <div className="flex-1 space-y-3 min-w-0">
                          <input
                            value={expanded === s.id ? subDraft.title : ""}
                            onChange={(e) => setSubDraft((d) => ({ ...d, title: e.target.value }))}
                            placeholder="Subservice name"
                            className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300"
                          />
                          <input
                            value={expanded === s.id ? subDraft.shortDescription : ""}
                            onChange={(e) => setSubDraft((d) => ({ ...d, shortDescription: e.target.value }))}
                            placeholder="One-line description (shown on the card)"
                            className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300"
                          />
                        </div>
                      </div>

                      {/* The long version, shown when someone opens the card. */}
                      <textarea
                        value={expanded === s.id ? subDraft.description : ""}
                        onChange={(e) => setSubDraft((d) => ({ ...d, description: e.target.value }))}
                        placeholder="Full description — the detail shown when the card is expanded"
                        rows={4}
                        className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300 resize-none"
                      />
                      <button
                        onClick={() => addSubservice(s.id)}
                        disabled={!subDraft.title.trim() || busy}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-white disabled:opacity-40 transition-transform hover:scale-[1.02]"
                        style={{ background: color }}
                      >
                        <Check className="w-4 h-4" /> Add subservice
                      </button>
                    </div>
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
