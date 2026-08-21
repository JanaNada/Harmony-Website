"use client";

import { useEffect, useMemo, useState } from "react";
import { useTolgee, useTranslate } from "@tolgee/react";
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2, X, CalendarDays, Clock, LogIn,
} from "lucide-react";
import { useBrief } from "@/state/BriefContext";
import { useAuth } from "@/app/auth";
import { api, formatDay, formatTime, SERVICE_TYPE_BY_ID, type Slot } from "@/lib/api";
import {
  findModule, SERVICE_BY_ID,
  C_ORANGE, C_PINK, C_GREEN,
  type GapQuestion,
} from "@/content/services";
import { arabicServiceTranslations } from "@/content/translations/ar-services";

type Answers = Record<string, string>;

function serviceTranslation(language: string, key: string, fallback: string) {
  return language === "ar"
    ? arabicServiceTranslations[key as keyof typeof arabicServiceTranslations] ?? fallback
    : fallback;
}

/* Three steps, in this order on purpose: the visitor confirms what they picked,
   answers only the questions their picks left open, and gives contact details
   last — asking for a name first is the biggest drop-off point. */

export function BookingPage({
  onBrowse,
  onSignIn,
}: {
  onBrowse: () => void;
  onSignIn?: () => void;
}) {
  const { t } = useTranslate();
  const tolgee = useTolgee(["language"]);
  const language = tolgee.getLanguage() ?? "en";
  const { selected, count, toggle, activeServices, clear } = useBrief();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({
    name: "", email: "", phone: "", company: "", note: "", when: "",
  });
  const [sent, setSent] = useState(false);

  // Meeting time selection
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* Which service the request is filed under. The brief can span several, so
     the first one picked leads and the rest ride along in the description. */
  const primaryService = activeServices[0];
  const serviceType = primaryService ? SERVICE_TYPE_BY_ID[primaryService] : "OTHER";

  useEffect(() => {
    const query = primaryService ? `?service=${SERVICE_TYPE_BY_ID[primaryService]}` : "";
    api
      .get<{ slots: Slot[] }>(`/scheduling/slots${query}`)
      .then((d) => setSlots(d.slots.filter((s) => s.status === "OPEN" && new Date(s.startsAt) > new Date())))
      .catch(() => setSlots([]));
  }, [primaryService]);

  /** Free slots grouped by day, so the picker reads like a calendar. */
  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = s.startsAt.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  const submit = async () => {
    if (!canSubmit || submitting) return;

    // A request has to belong to an account, so sign-in comes first.
    if (!user || user.role !== "COMPANY") {
      setSubmitError(
        user
          ? t("booking_staff_account_error", "You're signed in as staff. Use a client account to book an appointment.")
          : t("booking_signin_error", "Please sign in to your client account so we can attach this to your profile.")
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const picks = selected.map((id) => findModule(id)?.label).filter(Boolean).join(", ");
    const extras = Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join("\n");

    try {
      await api.post("/service-requests", {
        serviceType,
        title: picks ? picks.slice(0, 240) : "General enquiry",
        description:
          [contact.note, picks && `Selected: ${picks}`, extras].filter(Boolean).join("\n\n") ||
          "No further detail provided.",
        slotId: slotId ?? undefined,
        location: answers.city || undefined,
      });

      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("booking_send_error", "Could not send your request."));
    } finally {
      setSubmitting(false);
    }
  };

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));

  // Only ask about services they actually selected. Nothing chosen → skip
  // straight to contact, so "just talk to someone" stays a two-click path.
  const questionServices = activeServices;
  const steps = count > 0
    ? [t("booking_step_brief", "Your brief"), t("booking_step_details", "A few details"), t("booking_step_contact", "Your contact")]
    : [t("booking_step_contact", "Your contact")];
  const lastStep = steps.length - 1;

  const requiredMissing = questionServices
    .flatMap((sid) => SERVICE_BY_ID[sid].questions.filter((q) => q.required))
    .some((q) => !answers[q.id]);

  const canSubmit = contact.name.trim() && contact.email.trim() && !requiredMissing;

  if (sent) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#FAF7F2] flex items-center justify-center px-6 py-24">
        <div className="max-w-[560px] w-full text-center bg-white rounded-[40px] p-12 md:p-16 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.12)] border border-black/[0.05]">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-7"
            style={{ background: `${C_GREEN}18` }}
          >
            <CheckCircle2 size={30} style={{ color: C_GREEN }} />
          </div>
          <h1 className="font-extrabold text-4xl md:text-5xl text-[#1a1a1a] mb-4 tracking-tight leading-[1.15]">
            {t("booking_success_title", "Your brief is with us.")}
          </h1>
          <p className="text-base font-medium leading-[1.7] text-[#1a1a1a]/55 mb-9">
            {t("booking_success_desc", "One of our admins will call you within 24 hours to arrange a meeting and connect you with the right person from the team.")}
          </p>
          <button
            onClick={() => { clear(); setSent(false); setStep(0); onBrowse(); }}
            className="text-[14.5px] font-bold text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
          >
            {t("booking_back_site", "Back to the site")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[45vw] h-[45vw] bg-[#F5841F]/12 blur-[130px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[0%] w-[50vw] h-[50vw] bg-[#E91E8C]/12 blur-[140px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-[820px] mx-auto px-6 pt-16 md:pt-20 pb-32">
        <div className="text-center mb-12">
          <h1 className="font-extrabold text-5xl md:text-6xl tracking-tight leading-[1.1] mb-4">
            {t("booking_title", "Book your appointment")}
          </h1>
          <p className="text-base font-medium leading-[1.7] text-[#1a1a1a]/55">
            {t("booking_subtitle", "No cost, no commitment. We just need enough to bring the right person.")}
          </p>
        </div>

        {/* Step rail */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 ${
                  i === step ? "bg-white shadow-sm" : ""
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
                    i < step ? "text-white" : i === step ? "text-white" : "bg-black/[0.06] text-[#1a1a1a]/35"
                  }`}
                  style={i <= step ? { background: i < step ? C_GREEN : C_ORANGE } : undefined}
                >
                  {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`text-[12.5px] font-bold hidden sm:block ${
                    i === step ? "text-[#1a1a1a]" : "text-[#1a1a1a]/35"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && <span className="w-6 h-px bg-black/10" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.12)] border border-black/[0.05]">
          {/* ── Step 1: confirm the brief ─────────────────────────────── */}
          {count > 0 && step === 0 && (
            <div>
              <h2 className="font-extrabold text-2xl md:text-2xl mb-2.5 tracking-tight">
                {t("booking_picked_title", "Here's what you picked")}
              </h2>
              <p className="text-base text-[#1a1a1a]/50 font-medium leading-[1.7] mb-8">
                {t("booking_picked_desc", "Remove anything that doesn't belong, or")} {" "}
                <button
                  onClick={onBrowse}
                  className="font-bold underline underline-offset-2 hover:text-[#1a1a1a] transition-colors"
                >
                  {t("booking_keep_browsing", "keep browsing")}
                </button>{" "}
                to add more.
              </p>

              <div className="flex flex-col gap-8">
                {activeServices.map((sid) => {
                  const svc = SERVICE_BY_ID[sid];
                  return (
                    <div key={sid}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: svc.dim, color: svc.color }}>
                          <svc.icon size={15} />
                        </span>
                        <span className="text-sm font-extrabold text-[#1a1a1a]">
                          {serviceTranslation(language, `service_${sid}_label`, svc.label)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-1">
                        {selected
                          .filter((id) => findModule(id)?.serviceId === sid)
                          .map((id) => {
                            const mod = findModule(id);
                            if (!mod) return null;
                            return (
                              <button
                                key={id}
                                onClick={() => toggle(id)}
                                className="group inline-flex items-center gap-2 pl-3.5 pr-2.5 py-2 rounded-full border transition-colors"
                                style={{ background: svc.dim, borderColor: `${svc.color}30` }}
                              >
                                <span className="text-sm font-bold text-[#1a1a1a]/80">
                                  {serviceTranslation(language, `mod_${mod.id.replace(/-/g, "_")}_label`, mod.label)}
                                </span>
                                <X size={14} className="text-[#1a1a1a]/30 group-hover:text-[#1a1a1a]/70 transition-colors" />
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: gap questions ─────────────────────────────────── */}
          {count > 0 && step === 1 && (
            <div>
              <h2 className="font-extrabold text-2xl md:text-2xl mb-2.5 tracking-tight">
                {t("booking_details_title", "A few details")}
              </h2>
              <p className="text-base text-[#1a1a1a]/50 font-medium leading-[1.7] mb-9">
                {t("booking_details_desc", "Only what your selection doesn't already tell us.")}
              </p>

              <div className="flex flex-col gap-10">
                {questionServices.map((sid) => {
                  const svc = SERVICE_BY_ID[sid];
                  return (
                    <div key={sid}>
                      <div className="flex items-center gap-2.5 mb-6">
                        <span className="h-px w-6" style={{ background: svc.color }} />
                        <span
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: svc.color }}
                        >
                          {serviceTranslation(language, `service_${sid}_label`, svc.label)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-8">
                        {svc.questions.map((q) => (
                          <Question
                            key={q.id}
                            q={q}
                            value={answers[q.id] ?? ""}
                            onChange={(v) => set(q.id, v)}
                            color={svc.color}
                            dim={svc.dim}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Final: contact ────────────────────────────────────────── */}
          {step === lastStep && (
            <div>
              <h2 className="font-extrabold text-2xl md:text-2xl mb-2.5 tracking-tight">
                {t("booking_contact_title", "How do we reach you?")}
              </h2>
              <p className="text-base text-[#1a1a1a]/50 font-medium leading-[1.7] mb-9">
                {count > 0
                  ? t("booking_contact_last_desc", "Last step - then an admin will call you to arrange a meeting.")
                  : t("booking_contact_desc", "Tell us roughly what you're after and an admin will call you to arrange a meeting.")}
              </p>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label={t("booking_name", "Your name")} required value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} placeholder={t("placeholder_name", "Ahmed Hassan")} />
                  <Field label={t("booking_email", "Email")} required type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} placeholder={t("placeholder_email_brand", "ahmed@brand.com")} />
                  <Field label={t("booking_phone", "Phone")} value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} placeholder="+20 100 000 0000" />
                  <Field label={t("booking_company", "Company or brand")} value={contact.company} onChange={(v) => setContact({ ...contact, company: v })} placeholder={t("booking_optional", "Optional")} />
                </div>



                <div>
                  <Label>{t("booking_extra_label", "Anything else we should know?")}</Label>
                  <textarea
                    rows={4}
                    value={contact.note}
                    onChange={(e) => setContact({ ...contact, note: e.target.value })}
                    placeholder={count > 0 ? t("booking_optional", "Optional") : t("booking_goals_placeholder", "What are you trying to do?")}
                    className="w-full text-[14.5px] bg-[#FAF7F2] border border-black/[0.07] rounded-2xl px-5 py-4 outline-none focus:border-black/25 transition-colors resize-none placeholder:text-[#1a1a1a]/25"
                  />
                </div>
              </div>

              {/* ── Pick a meeting time ─────────────────────────────── */}
              <div className="mt-10 pt-8 border-t border-black/[0.06]">
                <h3 className="font-extrabold text-xl mb-2 tracking-tight flex items-center gap-2.5">
                  <Clock size={19} style={{ color: C_ORANGE }} />
                  {t("booking_choose_time", "Choose your meeting time")}
                </h3>
                <p className="text-base text-[#1a1a1a]/50 font-medium leading-[1.7] mb-6">
                  {slotsByDay.length > 0
                    ? t("booking_slots_desc", "These are the times we're free. Pick one and it's held for you.")
                    : t("booking_no_slots_desc", "No times are open right now - send the request and we'll call you to arrange one.")}
                </p>

                {slotsByDay.length > 0 && (
                  <div className="flex flex-col gap-6">
                    {slotsByDay.map(([day, daySlots]) => (
                      <div key={day}>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/40 mb-3">
                          {formatDay(daySlots[0].startsAt)}
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {daySlots.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSlotId(slotId === s.id ? null : s.id)}
                              className={`text-[14px] font-bold px-5 py-3 rounded-full border transition-all duration-200 ${
                                slotId === s.id
                                  ? "text-white scale-[1.03] border-transparent"
                                  : "bg-[#FAF7F2] border-black/[0.07] text-[#1a1a1a]/70 hover:border-black/25"
                              }`}
                              style={slotId === s.id ? { background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` } : undefined}
                            >
                              {formatTime(s.startsAt)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {requiredMissing && (
                <p className="mt-5 text-[13.5px] font-semibold text-[#E91E8C]">
                  {t("booking_missing_details", "Some details are still missing - go back one step.")}
                </p>
              )}

              {submitError && (
                <div className="mt-6 rounded-2xl bg-[#E91E8C]/8 border border-[#E91E8C]/20 px-5 py-4">
                  <p className="text-[14px] font-bold text-[#1a1a1a]/80">{submitError}</p>
                  {!user && onSignIn && (
                    <button
                      onClick={onSignIn}
                      className="mt-3 inline-flex items-center gap-2 text-[14px] font-bold text-white px-5 py-2.5 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
                    >
                      <LogIn size={15} /> {t("nav_signin", "Sign in")}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Nav ───────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-8 mt-10 pt-8 border-t border-black/[0.06]">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1a1a]/45 hover:text-[#1a1a1a] transition-colors"
              >
                <ArrowLeft size={16} /> {t("booking_back", "Back")}
              </button>
            ) : (
              <span />
            )}

            {step < lastStep ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 text-[14.5px] font-bold text-white px-8 py-3.5 rounded-full transition-transform duration-300 hover:scale-[1.04] shadow-[0_12px_24px_-10px_rgba(245,132,31,0.5)] group"
                style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
              >
                {t("booking_continue", "Continue")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canSubmit || submitting}
                className="inline-flex items-center gap-2.5 text-[14.5px] font-bold text-white px-9 py-4 rounded-full transition-transform duration-300 hover:scale-[1.04] shadow-[0_14px_28px_-10px_rgba(233,30,140,0.55)] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
              >
                <CalendarDays size={17} />
                {submitting ? t("booking_sending", "Sending...") : t("booking_request", "Request my appointment")}
              </button>
            )}
          </div>
        </div>

        {count === 0 && (
          <p className="text-center mt-8 text-[14.5px] text-[#1a1a1a]/45 font-medium">
            {t("booking_browse_prompt", "Want to pick specifics first?")} {" "}
            <button onClick={onBrowse} className="font-bold text-[#1a1a1a]/70 hover:text-[#1a1a1a] underline underline-offset-2 transition-colors">
              {t("booking_browse_services", "Browse the services")}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Small pieces ───────────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/40 block mb-2.5">
      {children}
    </label>
  );
}

function Chip({
  children, on, onClick, color,
}: {
  children: React.ReactNode; on: boolean; onClick: () => void; color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[13.5px] font-bold px-4.5 py-2.5 rounded-full border transition-all duration-200 ${
        on ? "text-white scale-[1.02]" : "bg-[#FAF7F2] border-black/[0.07] text-[#1a1a1a]/60 hover:border-black/20"
      }`}
      style={on ? { background: color, borderColor: color } : undefined}
    >
      {children}
    </button>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="text-[#E91E8C] ml-1">*</span>}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[14.5px] bg-[#FAF7F2] border border-black/[0.07] rounded-2xl px-5 py-3.5 outline-none focus:border-black/25 transition-colors placeholder:text-[#1a1a1a]/25"
      />
    </div>
  );
}

function Question({
  q, value, onChange, color, dim,
}: {
  q: GapQuestion; value: string; onChange: (v: string) => void;
  color: string; dim: string;
}) {
  const { t } = useTranslate();
  const questionKey = q.id.replace(/-/g, "_");
  const questionLabel = t(`booking_q_${questionKey}_label`, q.label);
  const questionOption = (option: string, index: number) =>
    t(`booking_q_${questionKey}_option_${index}`, option);

  return (
    <div>
      <Label>
        {questionLabel}
        {q.required && <span className="text-[#E91E8C] ml-1">*</span>}
      </Label>

      {q.type === "choice" && (
        <div className="flex flex-wrap gap-2.5">
          {q.options?.map((o, index) => (
            <Chip key={o} on={value === o} onClick={() => onChange(o)} color={color}>
              {questionOption(o, index)}
            </Chip>
          ))}
        </div>
      )}

      {q.type === "multichoice" && (
        <div className="flex flex-wrap gap-2.5">
          {q.options?.map((o, index) => {
            const current = value ? value.split(", ") : [];
            const on = current.includes(o);
            return (
              <Chip
                key={o}
                on={on}
                onClick={() => {
                  const next = on ? current.filter((x) => x !== o) : [...current, o];
                  onChange(next.join(", "));
                }}
                color={color}
              >
                {questionOption(o, index)}
              </Chip>
            );
          })}
        </div>
      )}

      {q.type === "select" && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[14.5px] bg-[#FAF7F2] border border-black/[0.07] rounded-2xl px-5 py-3.5 outline-none focus:border-black/25 transition-colors appearance-none cursor-pointer"
        >
          <option value="">{t("booking_select", "Select...")}</option>
          {q.options?.map((o, index) => (
            <option key={o} value={o}>{questionOption(o, index)}</option>
          ))}
        </select>
      )}

      {(q.type === "text" || q.type === "date") && (
        <input
          type={q.type === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          className="w-full text-[14.5px] bg-[#FAF7F2] border border-black/[0.07] rounded-2xl px-5 py-3.5 outline-none focus:border-black/25 transition-colors placeholder:text-[#1a1a1a]/25"
        />
      )}
    </div>
  );
}




