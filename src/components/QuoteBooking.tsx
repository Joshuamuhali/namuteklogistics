import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import {
  Truck, Building2, Construction, Tractor, ArrowUpDown, Check, ChevronLeft, ChevronRight,
  MessageCircle, Phone, Pencil, ChevronDown,
} from "lucide-react";
import { submitQuoteRequest } from "@/lib/quote.functions";
import { PHONES } from "@/components/shared";
import {
  DIVISIONS, FREIGHT_STREAMS, CARGO_BANDS, LOCATIONS, BUILDING_TYPES, PROJECT_STAGES,
  CIVIL_TYPES, EQUIPMENT, freightEstimate, formatZMW, locationByKey, type DivisionKey,
} from "@/lib/quote-config";
import { cn } from "@/lib/utils";

const ICONS: Record<DivisionKey, typeof Truck> = {
  freight: Truck, construction: Building2, civil: Construction, plant: Tractor,
};
const STEPS = ["Service", "Requirement", "Location", "Contact", "Review"];
const WHATSAPP = PHONES[0].tel.replace("+", "");

type State = {
  division?: DivisionKey;
  stream?: string; band?: string; cargo?: string; loads: number; date?: string;
  buildType?: string; area?: number; stage?: string;
  civilType?: string; civilQty?: number;
  equipment?: string; quantity: number; days?: number;
  origin?: string; originOther?: string; dest?: string; destOther?: string;
  site?: string;
  name?: string; company?: string; phone?: string; email?: string; details?: string;
};

const field =
  "w-full rounded-lg border border-input bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

function Tile({ active, onClick, title, sub, icon: Icon }: { active: boolean; onClick: () => void; title: string; sub?: string; icon?: typeof Truck }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        active ? "border-primary bg-accent" : "border-border hover:border-foreground/30",
      )}
    >
      {Icon && (
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
      </span>
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", active ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
        {active && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function Label({ children, opt }: { children: React.ReactNode; opt?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children} {opt && <span className="font-normal normal-case tracking-normal">(optional)</span>}
    </span>
  );
}

export function QuoteBooking() {
  const submit = useServerFn(submitQuoteRequest);
  const [step, setStep] = useState(0);
  const [s, setS] = useState<State>({ loads: 1, quantity: 1 });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const set = (p: Partial<State>) => setS((prev) => ({ ...prev, ...p }));

  const isFreight = s.division === "freight";
  const locName = (k?: string, other?: string) => (k === "other" ? other || "Custom location" : locationByKey(k)?.label);

  const estimate = useMemo(() => {
    if (s.division === "freight") {
      const e = freightEstimate(s.band, s.origin, s.dest, s.loads);
      return e ? { min: e.min, max: e.max, note: `≈ ${e.km} km${e.border ? " · incl. cross-border surcharge" : ""}` } : null;
    }
    if (s.division === "construction") {
      const t = BUILDING_TYPES.find((b) => b.key === s.buildType);
      return t && s.area ? { min: t.perM2[0] * s.area, max: t.perM2[1] * s.area, note: `${s.area} m² · build cost` } : null;
    }
    if (s.division === "civil") {
      const t = CIVIL_TYPES.find((c) => c.key === s.civilType);
      return t && s.civilQty ? { min: t.rate[0] * s.civilQty, max: t.rate[1] * s.civilQty, note: `${s.civilQty} ${t.unit}` } : null;
    }
    if (s.division === "plant") {
      const t = EQUIPMENT.find((e) => e.key === s.equipment);
      return t && s.days ? { min: t.perDay[0] * s.days * s.quantity, max: t.perDay[1] * s.days * s.quantity, note: `${s.quantity} × ${s.days} day(s), wet hire` } : null;
    }
    return null;
  }, [s]);

  const stepValid = [
    !!s.division,
    isFreight ? !!s.stream && !!s.band
      : s.division === "construction" ? !!s.buildType
      : s.division === "civil" ? !!s.civilType
      : !!s.equipment && !!s.days,
    isFreight
      ? !!s.origin && !!s.dest && s.origin !== s.dest && (s.origin !== "other" || !!s.originOther) && (s.dest !== "other" || !!s.destOther)
      : !!s.site && s.site.trim().length > 1,
    !!s.name && s.name.trim().length >= 2 && !!s.phone && s.phone.trim().length >= 7,
    true,
  ];

  const summaryRows: { label: string; value?: string; step: number }[] = [
    { label: "Service", value: DIVISIONS.find((d) => d.key === s.division)?.label, step: 0 },
    ...(isFreight
      ? [
          { label: "Stream", value: s.stream, step: 1 },
          { label: "Cargo", value: CARGO_BANDS.find((b) => b.key === s.band)?.label, step: 1 },
          { label: "Pickup", value: locName(s.origin, s.originOther), step: 2 },
          { label: "Delivery", value: locName(s.dest, s.destOther), step: 2 },
        ]
      : s.division === "construction"
      ? [
          { label: "Project", value: BUILDING_TYPES.find((b) => b.key === s.buildType)?.label, step: 1 },
          { label: "Area", value: s.area ? `${s.area} m²` : undefined, step: 1 },
          { label: "Site", value: s.site, step: 2 },
        ]
      : s.division === "civil"
      ? [
          { label: "Works", value: CIVIL_TYPES.find((c) => c.key === s.civilType)?.label, step: 1 },
          { label: "Site", value: s.site, step: 2 },
        ]
      : s.division === "plant"
      ? [
          { label: "Equipment", value: EQUIPMENT.find((e) => e.key === s.equipment)?.label, step: 1 },
          { label: "Duration", value: s.days ? `${s.quantity} unit(s) · ${s.days} day(s)` : undefined, step: 1 },
          { label: "Site", value: s.site, step: 2 },
        ]
      : []),
    { label: "Contact", value: s.name ? `${s.name}${s.phone ? ` · ${s.phone}` : ""}` : undefined, step: 3 },
  ];

  function buildText() {
    const lines = ["Namutek quotation request", ...summaryRows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`)];
    if (estimate) lines.push(`Indicative: ${formatZMW(estimate.min)} – ${formatZMW(estimate.max)}`);
    if (s.details) lines.push(`Notes: ${s.details}`);
    return lines.join("\n");
  }

  async function send() {
    setStatus("sending");
    setError("");
    const serviceType =
      s.division === "freight" ? (s.band === "60+" || s.stream?.includes("Heavy") ? "haulage" : "freight") : s.division!;
    const extra: Record<string, string> = {};
    const put = (k: string, v?: string | number) => { if (v !== undefined && v !== "") extra[k] = String(v); };
    put("stream", s.stream); put("cargoBand", s.band); put("cargo", s.cargo); put("loads", isFreight ? s.loads : undefined);
    put("date", s.date); put("buildType", s.buildType); put("area", s.area); put("stage", s.stage);
    put("civilType", s.civilType); put("civilQty", s.civilQty); put("equipment", s.equipment);
    put("quantity", s.division === "plant" ? s.quantity : undefined); put("days", s.days);
    const details = s.details && s.details.trim().length >= 10 ? s.details.trim() : buildText();
    try {
      await submit({
        data: {
          serviceType: serviceType as "freight",
          origin: isFreight ? locName(s.origin, s.originOther) : undefined,
          destination: isFreight ? locName(s.dest, s.destOther) : s.site,
          contactName: s.name!.trim(),
          companyName: s.company?.trim() || undefined,
          phone: s.phone!.trim(),
          email: s.email?.trim() || "",
          projectDetails: details.slice(0, 2000),
          extra,
          estimateMin: estimate ? Math.round(estimate.min) : undefined,
          estimateMax: estimate ? Math.round(estimate.max) : undefined,
        },
      });
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not send. Please try again or call us.");
    }
  }

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildText())}`;

  const Summary = (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Request summary</p>
      <dl className="mt-4 space-y-3">
        {summaryRows.filter((r) => r.value).length === 0 && (
          <p className="text-sm text-muted-foreground">Choose a service to start.</p>
        )}
        {summaryRows.filter((r) => r.value).map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{r.label}</dt>
              <dd className="font-semibold text-foreground">{r.value}</dd>
            </div>
            {status !== "done" && (
              <button type="button" onClick={() => setStep(r.step)} className="mt-1 text-muted-foreground hover:text-primary" aria-label={`Edit ${r.label}`}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </dl>
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">Indicative price</p>
        {estimate ? (
          <>
            <p className="mt-1 font-display text-3xl text-foreground">
              {formatZMW(estimate.min)} – {formatZMW(estimate.max)}
            </p>
            <p className="text-xs text-muted-foreground">{estimate.note}</p>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">Appears once the key details are filled in.</p>
        )}
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          Based on average Zambian market rates. Not a binding offer — Namutek confirms the official quotation.
        </p>
      </div>
    </div>
  );

  if (status === "done") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-border bg-card p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-6 w-6" /></span>
          <h3 className="mt-4 text-3xl text-foreground">Request received</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Our team will review it and call you back with an official quotation. For a faster reply, send it to our dispatch on WhatsApp too.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" /> Send on WhatsApp
            </a>
            <a href={`tel:${PHONES[0].tel}`} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-muted">
              <Phone className="h-4 w-4" /> {PHONES[0].display}
            </a>
          </div>
        </div>
        {Summary}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-xl border border-border bg-card">
        {/* Progress */}
        <div className="border-b border-border px-5 py-4 md:px-7">
          <div className="flex gap-1.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={cn("h-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
                <p className={cn("mt-2 hidden text-[11px] font-semibold uppercase tracking-wide sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground sm:hidden">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
        </div>

        <div className="min-h-[420px] px-5 py-6 md:px-7">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {step === 0 && (
                <>
                  <h3 className="text-3xl text-foreground">What do you need from Namutek?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Choose a service to start your quotation request.</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {DIVISIONS.map((d) => (
                      <Tile key={d.key} icon={ICONS[d.key]} title={d.label} sub={d.desc} active={s.division === d.key}
                        onClick={() => { set({ division: d.key }); setStep(1); }} />
                    ))}
                  </div>
                </>
              )}

              {step === 1 && isFreight && (
                <>
                  <h3 className="text-3xl text-foreground">What are we moving?</h3>
                  <Label>Service stream</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {FREIGHT_STREAMS.map((x) => <Tile key={x} title={x} active={s.stream === x} onClick={() => set({ stream: x })} />)}
                  </div>
                  <div className="mt-5"><Label>Cargo weight</Label></div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CARGO_BANDS.map((b) => <Tile key={b.key} title={b.label} sub={b.note} active={s.band === b.key} onClick={() => set({ band: b.key })} />)}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <label className="sm:col-span-2"><Label opt>Cargo description</Label><input className={field} maxLength={200} value={s.cargo ?? ""} onChange={(e) => set({ cargo: e.target.value })} placeholder="e.g. copper cathodes, cement, excavator" /></label>
                    <label><Label>Number of loads</Label><input className={field} type="number" min={1} max={500} value={s.loads} onChange={(e) => set({ loads: Math.max(1, Number(e.target.value) || 1) })} /></label>
                    <label><Label opt>Transport date</Label><input className={field} type="date" value={s.date ?? ""} onChange={(e) => set({ date: e.target.value })} /></label>
                  </div>
                </>
              )}

              {step === 1 && s.division === "construction" && (
                <>
                  <h3 className="text-3xl text-foreground">Tell us about the building</h3>
                  <Label>Project type</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {BUILDING_TYPES.map((b) => <Tile key={b.key} title={b.label} active={s.buildType === b.key} onClick={() => set({ buildType: b.key })} />)}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label><Label opt>Approx. floor area (m²)</Label><input className={field} type="number" min={1} max={1000000} value={s.area ?? ""} onChange={(e) => set({ area: Number(e.target.value) || undefined })} placeholder="e.g. 250" /></label>
                    <label><Label opt>Project stage</Label>
                      <select className={field} value={s.stage ?? ""} onChange={(e) => set({ stage: e.target.value })}>
                        <option value="">Select…</option>{PROJECT_STAGES.map((p) => <option key={p}>{p}</option>)}
                      </select></label>
                  </div>
                </>
              )}

              {step === 1 && s.division === "civil" && (
                <>
                  <h3 className="text-3xl text-foreground">What kind of works?</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CIVIL_TYPES.map((c) => <Tile key={c.key} title={c.label} sub={`Priced per ${c.unit}`} active={s.civilType === c.key} onClick={() => set({ civilType: c.key })} />)}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label><Label opt>Approx. quantity ({CIVIL_TYPES.find((c) => c.key === s.civilType)?.unit ?? "units"})</Label><input className={field} type="number" min={0} value={s.civilQty ?? ""} onChange={(e) => set({ civilQty: Number(e.target.value) || undefined })} /></label>
                    <label><Label opt>Project stage</Label>
                      <select className={field} value={s.stage ?? ""} onChange={(e) => set({ stage: e.target.value })}>
                        <option value="">Select…</option>{PROJECT_STAGES.map((p) => <option key={p}>{p}</option>)}
                      </select></label>
                  </div>
                </>
              )}

              {step === 1 && s.division === "plant" && (
                <>
                  <h3 className="text-3xl text-foreground">Which equipment do you need?</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {EQUIPMENT.map((e) => <Tile key={e.key} title={e.label} active={s.equipment === e.key} onClick={() => set({ equipment: e.key })} />)}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label><Label>Quantity</Label><input className={field} type="number" min={1} max={50} value={s.quantity} onChange={(e) => set({ quantity: Math.max(1, Number(e.target.value) || 1) })} /></label>
                    <label><Label>Hire duration (days)</Label><input className={field} type="number" min={1} max={730} value={s.days ?? ""} onChange={(e) => set({ days: Number(e.target.value) || undefined })} placeholder="e.g. 14" /></label>
                  </div>
                </>
              )}

              {step === 2 && isFreight && (
                <>
                  <h3 className="text-3xl text-foreground">Where to?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Set your pickup and delivery points.</p>
                  <div className="relative mt-5 rounded-xl border border-border p-4">
                    <div className="absolute bottom-[3.4rem] left-[1.6rem] top-[3.4rem] w-px bg-border" aria-hidden />
                    {(["origin", "dest"] as const).map((k) => (
                      <div key={k} className="flex items-start gap-3 py-2">
                        <span className={cn("mt-8 h-3 w-3 shrink-0", k === "origin" ? "rounded-full border-2 border-foreground" : "bg-primary")} />
                        <div className="flex-1">
                          <Label>{k === "origin" ? "Pickup / origin" : "Delivery / destination"}</Label>
                          <select className={field} value={s[k] ?? ""} onChange={(e) => set({ [k]: e.target.value } as Partial<State>)}>
                            <option value="">Choose location…</option>
                            {LOCATIONS.map((l) => <option key={l.key} value={l.key} disabled={l.key !== "other" && l.key === (k === "origin" ? s.dest : s.origin)}>{l.label}</option>)}
                          </select>
                          {s[k] === "other" && (
                            <input className={cn(field, "mt-2")} maxLength={120} placeholder="Type the town or site"
                              value={(k === "origin" ? s.originOther : s.destOther) ?? ""}
                              onChange={(e) => set(k === "origin" ? { originOther: e.target.value } : { destOther: e.target.value })} />
                          )}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => set({ origin: s.dest, dest: s.origin, originOther: s.destOther, destOther: s.originOther })}
                      className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary" aria-label="Swap pickup and delivery">
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                  {estimate === null && s.origin && s.dest && (
                    <p className="mt-3 text-xs text-muted-foreground">We'll price custom and regional routes in your official quotation.</p>
                  )}
                </>
              )}

              {step === 2 && !isFreight && (
                <>
                  <h3 className="text-3xl text-foreground">Where is the site?</h3>
                  <label className="mt-5 block"><Label>Site location</Label>
                    <input className={field} list="site-locs" maxLength={200} value={s.site ?? ""} onChange={(e) => set({ site: e.target.value })} placeholder="Town, area or plot" />
                    <datalist id="site-locs">{LOCATIONS.filter((l) => !["sadc", "other"].includes(l.key)).map((l) => <option key={l.key} value={l.label} />)}</datalist>
                  </label>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-3xl text-foreground">How do we reach you?</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label><Label>Your name</Label><input className={field} maxLength={120} value={s.name ?? ""} onChange={(e) => set({ name: e.target.value })} /></label>
                    <label><Label opt>Company</Label><input className={field} maxLength={160} value={s.company ?? ""} onChange={(e) => set({ company: e.target.value })} /></label>
                    <label><Label>Phone / WhatsApp</Label><input className={field} type="tel" maxLength={30} placeholder="+260 ..." value={s.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} /></label>
                    <label><Label opt>Email</Label><input className={field} type="email" maxLength={255} value={s.email ?? ""} onChange={(e) => set({ email: e.target.value })} /></label>
                    <label className="sm:col-span-2"><Label opt>Anything else we should know?</Label><textarea className={field} rows={3} maxLength={1500} value={s.details ?? ""} onChange={(e) => set({ details: e.target.value })} /></label>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    We use these details only to prepare and respond to your quotation. They are never sold or shared with third parties.
                  </p>
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="text-3xl text-foreground">Review and send</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Check your request. You can edit anything from the summary.</p>
                  <div className="mt-5 rounded-xl bg-muted p-4 text-sm whitespace-pre-line text-foreground">{buildText()}</div>
                  {status === "error" && <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-b-xl border-t border-border bg-card px-5 py-4 md:px-7">
          <button type="button" onClick={() => setStep((n) => Math.max(0, n - 1))} disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted disabled:invisible">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button type="button" onClick={() => setStep((n) => n + 1)} disabled={!stepValid[step]}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 sm:flex-none">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-1 flex-wrap justify-end gap-2">
              <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <button type="button" onClick={send} disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send request"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary: sticky on desktop, collapsible on mobile */}
      <div className="hidden lg:block"><div className="sticky top-24">{Summary}</div></div>
      <div className="lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold">
          Request summary {estimate && <span className="text-primary">{formatZMW(estimate.min)}+</span>}
          <ChevronDown className={cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180")} />
        </button>
        {summaryOpen && <div className="mt-2">{Summary}</div>}
      </div>
    </div>
  );
}
