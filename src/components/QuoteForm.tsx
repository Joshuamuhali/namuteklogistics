import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitQuoteRequest } from "@/lib/quote.functions";
import { PHONES, PhoneLinks } from "@/components/shared";

const SERVICES = {
  freight: {
    label: "Freight transportation",
    extras: [
      { key: "cargo", label: "What cargo are you transporting?" },
      { key: "volume", label: "Approx. weight or volume" },
      { key: "frequency", label: "One-off or regular transport?" },
    ],
  },
  haulage: {
    label: "Heavy-duty haulage",
    extras: [
      { key: "load", label: "Load type and dimensions" },
      { key: "equipment", label: "Equipment or trailer type needed (if known)" },
      { key: "frequency", label: "One-off or regular transport?" },
    ],
  },
  logistics: {
    label: "Logistics & distribution",
    extras: [
      { key: "scope", label: "Services needed (planning, dispatch, distribution, final-mile)" },
      { key: "frequency", label: "How often do you need this service?" },
    ],
  },
  construction: {
    label: "Building construction & civil works",
    extras: [
      { key: "projectType", label: "Project type (residential, commercial, industrial, civil works)" },
      { key: "timeline", label: "Expected start or timeline" },
    ],
  },
} as const;

type ServiceKey = keyof typeof SERVICES;

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40";

export function QuoteForm() {
  const submit = useServerFn(submitQuoteRequest);
  const [serviceType, setServiceType] = useState<ServiceKey>("freight");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("submitting");
    setErrorMessage("");

    const extra: Record<string, string> = {};
    for (const { key } of SERVICES[serviceType].extras) {
      const value = String(form.get(`extra_${key}`) ?? "").trim();
      if (value) extra[key] = value;
    }

    try {
      await submit({
        data: {
          serviceType,
          origin: String(form.get("origin") ?? "").trim() || undefined,
          destination: String(form.get("destination") ?? "").trim() || undefined,
          contactName: String(form.get("contactName") ?? ""),
          companyName: String(form.get("companyName") ?? "").trim() || undefined,
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? "").trim(),
          projectDetails: String(form.get("projectDetails") ?? ""),
          extra,
        },
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not submit your request. Please try again or call us.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h3 className="text-2xl text-primary">Thank you — request received</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Our team will review your enquiry and get back to you shortly. If it is
          urgent, call us directly:
        </p>
        <PhoneLinks className="mt-4 items-center text-primary" />
      </div>
    );
  }

  const destinationLabel =
    serviceType === "construction" ? "Project site location" : "Drop-off / destination";

  return (
    <form
      onSubmit={handleSubmit}
      id="quote"
      className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <h3 className="text-2xl text-foreground">Request a Quote</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us what you need and we will come back to you with a plan and a price.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="serviceType" className="mb-1 block text-sm font-semibold">
            Service type <span className="text-primary">*</span>
          </label>
          <select
            id="serviceType"
            name="serviceType"
            required
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceKey)}
            className={inputClass}
          >
            {(Object.keys(SERVICES) as ServiceKey[]).map((key) => (
              <option key={key} value={key}>
                {SERVICES[key].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="origin" className="mb-1 block text-sm font-semibold">
            Pick-up / origin
          </label>
          <input id="origin" name="origin" maxLength={200} placeholder="e.g. Lusaka" className={inputClass} />
        </div>
        <div>
          <label htmlFor="destination" className="mb-1 block text-sm font-semibold">
            {destinationLabel}
          </label>
          <input
            id="destination"
            name="destination"
            maxLength={200}
            placeholder={serviceType === "construction" ? "e.g. Kitwe, Copperbelt" : "e.g. Ndola, Copperbelt"}
            className={inputClass}
          />
        </div>

        {SERVICES[serviceType].extras.map((field) => (
          <div key={field.key} className={SERVICES[serviceType].extras.length > 2 ? "md:col-span-1" : "md:col-span-2"}>
            <label htmlFor={`extra_${field.key}`} className="mb-1 block text-sm font-semibold">
              {field.label}
            </label>
            <input
              id={`extra_${field.key}`}
              name={`extra_${field.key}`}
              maxLength={500}
              className={inputClass}
            />
          </div>
        ))}

        <div>
          <label htmlFor="contactName" className="mb-1 block text-sm font-semibold">
            Your name <span className="text-primary">*</span>
          </label>
          <input id="contactName" name="contactName" required maxLength={120} className={inputClass} />
        </div>
        <div>
          <label htmlFor="companyName" className="mb-1 block text-sm font-semibold">
            Company (optional)
          </label>
          <input id="companyName" name="companyName" maxLength={160} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold">
            Phone <span className="text-primary">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            placeholder="+260 ..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            Email (optional)
          </label>
          <input id="email" name="email" type="email" maxLength={255} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="projectDetails" className="mb-1 block text-sm font-semibold">
            Project details <span className="text-primary">*</span>
          </label>
          <textarea
            id="projectDetails"
            name="projectDetails"
            required
            rows={4}
            maxLength={2000}
            placeholder="Describe your goods, route, site or project so we can prepare an accurate quote."
            className={inputClass}
          />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Privacy note: we use the details you provide here only to prepare and respond
        to your quote enquiry. Your information is never sold or shared with third
        parties, and is kept no longer than needed to handle your enquiry.
      </p>

      {status === "error" && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage || "Something went wrong. Please try again or call us."}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Request"}
        </button>
        <div className="text-sm text-muted-foreground">
          Prefer to talk? <PhoneLinks className="text-primary" />
        </div>
      </div>
    </form>
  );
}
