import { createFileRoute } from "@tanstack/react-router";
import { CTABand, PHONES, PhoneLinks } from "@/components/shared";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Request a Quote — Namutek Logistics Limited" },
      {
        name: "description",
        content:
          "Request a quote for freight, haulage, logistics or construction services. Call +260 966 445513 or +260 976 699145. Foxdale, Lusaka, Zambia.",
      },
      { property: "og:title", content: "Contact & Request a Quote — Namutek Logistics Limited" },
      {
        property: "og:description",
        content:
          "Request a quote for freight, haulage, logistics or construction services across Zambia.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="bg-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Contact Us</p>
          <h1 className="mt-2 text-4xl text-background md:text-5xl">
            Tell us what you need moved or built
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl text-primary">Call us</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Our lines are open for enquiries and dispatch.
              </p>
              <PhoneLinks className="mt-4 gap-3 text-lg text-foreground" />
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl text-primary">Head office</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                Plot No. 3074M off Zambezi Road,
                <br />
                Foxdale, Lusaka, Lusaka Province,
                <br />
                Zambia
              </p>
              <a
                href="https://www.namuteklogistics.com"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                www.namuteklogistics.com
              </a>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl text-primary">Company details</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Registered name</dt>
                  <dd className="text-right font-semibold">Namutek Logistics Limited</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">PACRA reg. no.</dt>
                  <dd className="text-right font-semibold">120251021409</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Established</dt>
                  <dd className="text-right font-semibold">2018</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <QuoteForm />
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
