import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroTruck from "@/assets/hero-truck.jpg";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Namutek Logistics Limited — Freight, Haulage & Construction in Zambia",
      },
      {
        name: "description",
        content:
          "Dependable freight transportation, heavy-duty haulage, logistics, building construction and civil works across Zambia and regional routes. Request a quote today.",
      },
      { property: "og:title", content: "Namutek Logistics Limited — Freight, Haulage & Construction in Zambia" },
      {
        property: "og:description",
        content:
          "Dependable freight transportation, heavy-duty haulage, logistics and construction services across Zambia. Request a quote today.",
      },
    ],
  }),
  component: Index,
});

const SERVICES = [
  {
    n: "01",
    title: "Transportation",
    desc: "Point-to-point commercial freight, bulk and general cargo, heavy-duty haulage, long-distance and cross-border transport.",
  },
  {
    n: "02",
    title: "Logistics",
    desc: "Transport planning, fleet coordination, dispatch, distribution and delivery management.",
  },
  {
    n: "03",
    title: "Building Construction",
    desc: "Residential, commercial, industrial and institutional buildings, extensions and refurbishment.",
  },
  {
    n: "04",
    title: "Civil & Infrastructure",
    desc: "Earthworks, roads, drainage, culverts, site development and project support.",
  },
];

const PILLARS = [
  { title: "Reliable", desc: "Timely, consistent delivery and operations that keep running smoothly." },
  { title: "Professional", desc: "Skilled people, clear processes and a safety-first approach on every assignment." },
  { title: "Innovative", desc: "Modern tools and practical thinking that deliver effective, competitive solutions." },
  { title: "Community-focused", desc: "Deeply rooted in the Zambian context, fostering local development." },
  { title: "Affordable", desc: "Value-driven, accessible services with transparent pricing and strong value for money." },
];

const STATS = [
  { value: "2018", label: "Year established" },
  { value: "4", label: "Core service areas" },
  { value: "Zambia +", label: "Regional routes served" },
  { value: "24/7", label: "Operational focus" },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <img
          src={heroTruck}
          alt="Namutek prime mover hauling a flatbed trailer on a Zambian highway"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/75 to-foreground/35" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Transportation · Logistics · Construction
            </p>
            <h1 className="mt-4 text-5xl leading-[0.95] text-background md:text-7xl">
              Moving Zambia's goods.
              <br />
              Building its future.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-background/85">
              Namutek Logistics Limited keeps businesses supplied, projects moving
              and operations running — with dependable freight, haulage, logistics
              and construction services across Zambia and selected regional markets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get a Quote
              </Link>
              <Link
                to="/services"
                className="rounded-md border border-background/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-background transition-colors hover:bg-background/10"
              >
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="text-4xl text-primary">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services at a glance */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Our Services
          </p>
          <h2 className="mt-2 text-4xl text-foreground md:text-5xl">
            Four areas. One dependable partner.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <Link
                to="/services"
                className="group block h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <span className="text-3xl text-primary">{s.n}</span>
                <h3 className="mt-3 text-2xl text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <span className="mt-4 inline-block text-sm font-bold uppercase tracking-wide text-primary">
                  Learn more →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-4xl text-foreground md:text-5xl">
              Built on five core pillars
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-lg border border-border bg-card p-5">
                  <div className="h-1 w-8 rounded bg-primary" />
                  <h3 className="mt-4 text-xl text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-10 border-l-4 border-primary pl-4 text-lg text-foreground">
              We plan carefully. We work responsibly. We deliver on our commitments.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
