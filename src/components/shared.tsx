import { Link } from "@tanstack/react-router";

export const PHONES = [
  { display: "+260 966 445513", tel: "+260966445513" },
  { display: "+260 976 699145", tel: "+260976699145" },
] as const;

export function PhoneLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {PHONES.map((p) => (
        <a
          key={p.tel}
          href={`tel:${p.tel}`}
          className="inline-flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {p.display}
        </a>
      ))}
    </div>
  );
}

export function CTABand() {
  return (
    <section className="bg-primary">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl text-primary-foreground md:text-4xl">
            Need something moved or built?
          </h2>
          <p className="mt-2 max-w-xl text-primary-foreground/85">
            Request a quote today — we plan carefully, work responsibly and deliver
            on our commitments.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Link
            to="/contact"
            className="rounded-md bg-primary-foreground px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary-foreground/90"
          >
            Request a Quote
          </Link>
          <PhoneLinks className="text-primary-foreground" />
        </div>
      </div>
    </section>
  );
}
