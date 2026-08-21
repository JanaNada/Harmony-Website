"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Check, X, ChevronDown, ChevronRight, Power, Palette, Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { api } from "@/lib/api";
import { ImagePicker } from "./ImagePicker";

export interface Subservice {
  id: number;
  serviceId: number;
  sectionId: number;
  title: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Section {
  id: number;
  serviceId: number;
  title: string;
  sortOrder: number;
  subservices: Subservice[];
}

export interface CatalogService {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  icon: string;
  accentColor: string | null;
  sortOrder: number;
  isActive: boolean;
  sections: Section[];
  subservices: Subservice[];
}

const PRESET_COLORS = ["#F5841F", "#E91E8C", "#3AADE0", "#78BE1F", "#7C5CFF", "#00B8A9", "#D7263D", "#1A1A1A"];

const EMPTY_DRAFT = { title: "", tagline: "", description: "", icon: "", accentColor: PRESET_COLORS[0], imageUrl: null as string | null };
const EMPTY_SUB_DRAFT = { title: "", shortDescription: "", description: "", imageUrl: null as string | null, sectionId: "" };

export function ServiceBuilder() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState(EMPTY_DRAFT);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [subDrafts, setSubDrafts] = useState<Record<number, typeof EMPTY_SUB_DRAFT>>({});
  const [sectionDrafts, setSectionDrafts] = useState<Record<number, string>>({});
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionEditTitle, setSectionEditTitle] = useState("");
  const [editingSubserviceId, setEditingSubserviceId] = useState<number | null>(null);
  const [subEditDraft, setSubEditDraft] = useState<typeof EMPTY_SUB_DRAFT>(EMPTY_SUB_DRAFT);

  const load = useCallback(async () => {
    try {
      const data = await api.get<{ services: CatalogService[] }>("/catalog");
      setServices(
        (data.services ?? []).map((service) => ({
          ...service,
          sections: Array.isArray(service.sections) ? service.sections : [],
          subservices: Array.isArray(service.subservices) ? service.subservices : [],
        }))
      );
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
      window.dispatchEvent(new Event("catalogChanged"));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const startEditingService = (service: CatalogService) => {
    setEditingServiceId(service.id);
    setEditDraft({
      title: service.title,
      tagline: service.tagline ?? "",
      description: service.description ?? "",
      icon: service.icon ?? "",
      accentColor: service.accentColor ?? PRESET_COLORS[0],
      imageUrl: service.imageUrl,
    });
  };

  const startEditingSection = (sectionId: number, title: string) => {
    setEditingSectionId(sectionId);
    setSectionEditTitle(title);
  };

  const startEditingSubservice = (service: CatalogService, sub: Subservice) => {
    setEditingSubserviceId(sub.id);
    setSubEditDraft({
      title: sub.title,
      shortDescription: sub.shortDescription ?? "",
      description: sub.description ?? "",
      imageUrl: sub.imageUrl,
      sectionId: String(sub.sectionId),
    });
    setExpanded(service.id);
  };

  const saveSectionEdit = (sectionId: number) => run(async () => {
    await api.put(`/catalog/sections/${sectionId}`, { title: sectionEditTitle });
    setEditingSectionId(null);
    setSectionEditTitle("");
  });

  const addSection = (serviceId: number) => run(async () => {
    const title = sectionDrafts[serviceId]?.trim();
    if (!title) return;
    await api.post(`/catalog/services/${serviceId}/sections`, { title });
    setSectionDrafts((drafts) => ({ ...drafts, [serviceId]: "" }));
  });

  const addSubservice = (serviceId: number) => run(async () => {
    const draft = subDrafts[serviceId] ?? EMPTY_SUB_DRAFT;
    await api.post(`/catalog/services/${serviceId}/subservices`, {
      ...draft,
      sectionId: Number(draft.sectionId),
    });
    setSubDrafts((drafts) => ({ ...drafts, [serviceId]: { ...EMPTY_SUB_DRAFT } }));
  });

  const confirmDelete = (message: string) => {
    return window.confirm(message);
  };

  const saveSubserviceEdit = (subserviceId: number) => run(async () => {
    await api.put(`/catalog/subservices/${subserviceId}`, {
      ...subEditDraft,
      sectionId: Number(subEditDraft.sectionId),
    });
    setEditingSubserviceId(null);
    setSubEditDraft(EMPTY_SUB_DRAFT);
  });

  const toggleHidden = (serviceId: string, isHidden: boolean) =>
    run(async () => {
      if (isHidden) {
        await api.del(`/catalog/hidden/${serviceId}`);
      } else {
        await api.post(`/catalog/hidden/${serviceId}`);
      }
    });

  return (
    <div className="animate-in fade-in duration-700 w-full">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Service Architect</h1>
        <p className="text-gray-500 mt-2 text-lg">Add a service, pick the colour its page uses, and build up its sections and subservices.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">{error}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${draft.accentColor}18`, color: draft.accentColor }}>
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-6">New service</h3>
            <div className="space-y-5">
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Service name" className="w-full border-b-2 border-gray-200 px-1 py-3 text-lg font-bold text-gray-900 outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300" />
              <input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder="Tagline (one line)" className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300" />
              <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What this service covers" rows={3} className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 resize-none placeholder-gray-300" />
              <input value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} placeholder="Icon name (e.g. Building2, Megaphone)" className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300" />
              <ImagePicker value={draft.imageUrl} onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))} label="Service image" />
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3"><Palette className="w-4 h-4" /> Page colour</label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button key={c} onClick={() => setDraft({ ...draft, accentColor: c })} aria-label={`Use ${c}`} className={`w-9 h-9 rounded-xl transition-all ${draft.accentColor === c ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-110"}`} style={{ background: c }} />
                  ))}
                  <label className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                    <input type="color" value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} className="opacity-0 w-0 h-0" />
                    <Plus className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>
              <button onClick={() => run(async () => { await api.post("/catalog/services", draft); setDraft(EMPTY_DRAFT); })} disabled={!draft.title.trim() || busy} className="w-full py-4 rounded-full font-black text-white shadow-xl hover:-translate-y-1 transition-all text-lg disabled:opacity-40 disabled:hover:translate-y-0" style={{ background: draft.accentColor }}>Create service</button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 w-full min-w-0">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{services.length} service{services.length === 1 ? "" : "s"}</h3>
          {services.map((service) => {
            const color = service.accentColor ?? "#8A8A8A";
            const open = expanded === service.id;
            const sections = [...(Array.isArray(service.sections) ? service.sections : [])].sort((a, b) => a.sortOrder - b.sortOrder);

            return (
              <div key={service.id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-lg overflow-hidden" style={{ borderLeft: `6px solid ${color}` }}>
                <div className="p-6 flex items-start justify-between gap-4">
                  <button onClick={() => setExpanded(open ? null : service.id)} className="flex items-start gap-3 text-left min-w-0 flex-1">
                    {open ? <ChevronDown className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />}
                    <span className="min-w-0">
                      <span className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-2xl font-black text-gray-900">{service.title}</span>
                        {!service.isActive && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-gray-200 text-gray-500">Hidden</span>}
                      </span>
                      {service.tagline && <span className="block text-gray-500 font-bold">{service.tagline}</span>}
                      <span className="block text-xs font-bold text-gray-400 mt-1">{sections.length} section{sections.length === 1 ? "" : "s"}</span>
                    </span>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input type="color" value={color} onChange={(e) => run(() => api.put(`/catalog/services/${service.id}`, { accentColor: e.target.value }))} title="Change page colour" className="w-9 h-9 rounded-xl border-0 cursor-pointer bg-transparent p-0" />
                    <button onClick={() => startEditingService(service)} title="Edit service" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => run(() => api.put(`/catalog/services/${service.id}`, { isActive: !service.isActive }))} title={service.isActive ? "Hide from site" : "Show on site"} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${service.isActive ? "bg-[#78BE1F]/10 text-[#78BE1F]" : "bg-gray-100 text-gray-400"}`}><Power className="w-4 h-4" /></button>
                  </div>
                </div>

                {editingServiceId === service.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5 bg-gray-50/60">
                    <div className="grid gap-3">
                      <input value={editDraft.title} onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900" />
                      <input value={editDraft.tagline} onChange={(e) => setEditDraft({ ...editDraft, tagline: e.target.value })} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-700 border border-gray-200 outline-none focus:border-gray-900" />
                      <textarea value={editDraft.description} onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })} rows={3} className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900 resize-none" />
                      <input value={editDraft.icon} onChange={(e) => setEditDraft({ ...editDraft, icon: e.target.value })} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-700 border border-gray-200 outline-none focus:border-gray-900" />
                      <ImagePicker value={editDraft.imageUrl} onChange={(url) => setEditDraft((d) => ({ ...d, imageUrl: url }))} compact={false} label="Service image" />
                      <div className="flex gap-3">
                        <button onClick={() => run(async () => { await api.put(`/catalog/services/${editingServiceId}`, editDraft); setEditingServiceId(null); setEditDraft(EMPTY_DRAFT); })} className="px-5 py-3 rounded-2xl font-black text-white" style={{ background: service.accentColor ?? PRESET_COLORS[0] }}>Save</button>
                        <button onClick={() => { setEditingServiceId(null); setEditDraft(EMPTY_DRAFT); }} className="px-5 py-3 rounded-2xl font-black text-gray-600 bg-white border border-gray-200">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

                {open && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5 space-y-5">
                    {sections.length === 0 && <p className="text-sm font-bold text-gray-400">No sections yet.</p>}

                    {sections.map((section, idx) => (
                      <div key={section.id} className="rounded-[1.5rem] bg-white border border-gray-100 overflow-hidden">
                        <div className="p-5 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xl font-black text-gray-900">{section.title}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => startEditingSection(section.id, section.title)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button
                              onClick={() => {
                                if (
                                  confirmDelete(
                                    `Delete "${section.title}"?\n\nThis will permanently delete the section and all subservices inside it.`
                                  )
                                ) {
                                  run(() => api.del(`/catalog/sections/${section.id}`));
                                }
                              }}
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete section"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button disabled={idx === 0} onClick={() => run(() => api.post(`/catalog/sections/${section.id}/move`, { direction: "up" }))} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"><ArrowUp className="w-4 h-4" /></button>
                            <button disabled={idx === sections.length - 1} onClick={() => run(() => api.post(`/catalog/sections/${section.id}/move`, { direction: "down" }))} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"><ArrowDown className="w-4 h-4" /></button>
                          </div>
                        </div>

                        {editingSectionId === section.id && (
                          <div className="px-5 pb-5">
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                              <input value={sectionEditTitle} onChange={(e) => setSectionEditTitle(e.target.value)} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900" />
                              <div className="flex gap-3">
                                <button onClick={() => saveSectionEdit(section.id)} className="px-5 py-3 rounded-2xl font-black text-white" style={{ background: color }}>Save</button>
                                <button onClick={() => { setEditingSectionId(null); setSectionEditTitle(""); }} className="px-5 py-3 rounded-2xl font-black text-gray-600 bg-white border border-gray-200">Cancel</button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="px-5 pb-5 space-y-3">
                          {section.subservices.length === 0 && <p className="text-sm font-bold text-gray-400">No subservices yet.</p>}
                          {([...section.subservices].sort((a, b) => a.sortOrder - b.sortOrder)).map((sub, subIndex, orderedSubservices) => (
                            <div key={sub.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50">
                              <div className="flex items-center gap-4 min-w-0">
                                {sub.imageUrl ? <img src={sub.imageUrl} alt={sub.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200" /> : <div className="w-14 h-14 rounded-xl bg-gray-200/60 flex-shrink-0" />}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-black text-gray-900">{sub.title}</p>
                                    {!sub.isActive && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-gray-200 text-gray-500">Hidden</span>}
                                  </div>
                                  {sub.shortDescription && <p className="text-sm font-medium text-gray-500">{sub.shortDescription}</p>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => startEditingSubservice(service, sub)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => run(() => api.put(`/catalog/subservices/${sub.id}`, { isActive: !sub.isActive }))} title={sub.isActive ? "Hide from site" : "Show on site"} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${sub.isActive ? "bg-[#78BE1F]/10 text-[#78BE1F]" : "bg-gray-100 text-gray-400"}`}><Power className="w-4 h-4" /></button>
                                <button
                                  onClick={() => {
                                    if (
                                      confirmDelete(
                                        `Delete "${sub.title}"?\n\nThis will permanently delete this subservice.`
                                      )
                                    ) {
                                      run(() => api.del(`/catalog/subservices/${sub.id}`));
                                    }
                                  }}
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  title="Delete subservice"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button disabled={subIndex === 0} onClick={() => run(() => api.post(`/catalog/subservices/${sub.id}/move`, { direction: "up" }))} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent" title="Move up"><ArrowUp className="w-4 h-4" /></button>
                                <button disabled={subIndex === orderedSubservices.length - 1} onClick={() => run(() => api.post(`/catalog/subservices/${sub.id}/move`, { direction: "down" }))} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent" title="Move down"><ArrowDown className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}

                          {editingSubserviceId === section.subservices[0]?.id && null}

                          {section.subservices.some((s) => s.id === editingSubserviceId) && (
                            <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-3">
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Edit subservice</p>
                              <div className="flex gap-3 items-start">
                                <ImagePicker value={subEditDraft.imageUrl} onChange={(url) => setSubEditDraft((d) => ({ ...d, imageUrl: url }))} compact />
                                <div className="flex-1 space-y-3 min-w-0">
                                  <input value={subEditDraft.title} onChange={(e) => setSubEditDraft((d) => ({ ...d, title: e.target.value }))} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900" />
                                  <input value={subEditDraft.shortDescription} onChange={(e) => setSubEditDraft((d) => ({ ...d, shortDescription: e.target.value }))} className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900" />
                                </div>
                              </div>
                              <textarea value={subEditDraft.description} onChange={(e) => setSubEditDraft((d) => ({ ...d, description: e.target.value }))} rows={4} className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900 resize-none" />
                              <select value={subEditDraft.sectionId} onChange={(e) => setSubEditDraft((d) => ({ ...d, sectionId: e.target.value }))} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-700 border border-gray-200 outline-none focus:border-gray-900">
                                {sections.map((sec) => <option key={sec.id} value={sec.id}>{sec.title}</option>)}
                              </select>
                              <div className="flex gap-3">
                                <button onClick={() => saveSubserviceEdit(editingSubserviceId!)} className="px-5 py-3 rounded-2xl font-black text-white" style={{ background: color }}>Save</button>
                                <button onClick={() => { setEditingSubserviceId(null); setSubEditDraft(EMPTY_SUB_DRAFT); }} className="px-5 py-3 rounded-2xl font-black text-gray-600 bg-white border border-gray-200">Cancel</button>
                              </div>
                            </div>
                          )}

                          <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-3">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Add a subservice</p>
                            <div className="flex gap-3 items-start">
                              <ImagePicker value={(subDrafts[service.id] ?? EMPTY_SUB_DRAFT).imageUrl} onChange={(url) => setSubDrafts((drafts) => ({ ...drafts, [service.id]: { ...(drafts[service.id] ?? EMPTY_SUB_DRAFT), imageUrl: url } }))} compact />
                              <div className="flex-1 space-y-3 min-w-0">
                                <input value={(subDrafts[service.id] ?? EMPTY_SUB_DRAFT).title} onChange={(e) => setSubDrafts((drafts) => ({ ...drafts, [service.id]: { ...(drafts[service.id] ?? EMPTY_SUB_DRAFT), title: e.target.value } }))} placeholder="Subservice name" className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300" />
                                <input value={(subDrafts[service.id] ?? EMPTY_SUB_DRAFT).shortDescription} onChange={(e) => setSubDrafts((drafts) => ({ ...drafts, [service.id]: { ...(drafts[service.id] ?? EMPTY_SUB_DRAFT), shortDescription: e.target.value } }))} placeholder="One-line description (shown on the card)" className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300" />
                                <select value={(subDrafts[service.id] ?? EMPTY_SUB_DRAFT).sectionId} onChange={(e) => setSubDrafts((drafts) => ({ ...drafts, [service.id]: { ...(drafts[service.id] ?? EMPTY_SUB_DRAFT), sectionId: e.target.value } }))} className="w-full bg-white rounded-2xl px-4 py-3 font-bold text-gray-700 border border-gray-200 outline-none focus:border-gray-900">
                                  <option value="">Choose a section</option>
                                  {sections.map((sec) => <option key={sec.id} value={sec.id}>{sec.title}</option>)}
                                </select>
                              </div>
                            </div>
                            <textarea value={(subDrafts[service.id] ?? EMPTY_SUB_DRAFT).description} onChange={(e) => setSubDrafts((drafts) => ({ ...drafts, [service.id]: { ...(drafts[service.id] ?? EMPTY_SUB_DRAFT), description: e.target.value } }))} placeholder="Full description" rows={4} className="w-full bg-white rounded-2xl px-4 py-3 font-medium text-gray-700 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300 resize-none" />
                            <button onClick={() => addSubservice(service.id)} disabled={!(subDrafts[service.id]?.title?.trim()) || !(subDrafts[service.id]?.sectionId) || busy} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-white disabled:opacity-40 transition-transform hover:scale-[1.02]" style={{ background: color }}><Check className="w-4 h-4" /> Add subservice</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-3">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Add section</p>
                      <div className="flex gap-3">
                        <input value={sectionDrafts[service.id] ?? ""} onChange={(e) => setSectionDrafts((drafts) => ({ ...drafts, [service.id]: e.target.value }))} placeholder="Section name" className="flex-1 bg-white rounded-2xl px-4 py-3 font-bold text-gray-800 border border-gray-200 outline-none focus:border-gray-900 placeholder-gray-300" />
                        <button onClick={() => addSection(service.id)} disabled={!(sectionDrafts[service.id] ?? "").trim() || busy} className="px-5 py-3 rounded-2xl font-black text-white disabled:opacity-40" style={{ background: color }}>Add section</button>
                      </div>
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
