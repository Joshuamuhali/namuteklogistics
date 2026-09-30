import { createFileRoute, Link } from "@tanstack/react-router";
import civilWorks from "@/assets/civil-works.jpg";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Namutek Logistics Limited" },
      {
        name: "description",
        content:
          "Freight transportation, heavy-duty haulage, logistics coordination, building construction and civil infrastructure services across Zambia and regional routes.",
      },
      { property: "og:title", content: "Our Services — Namutek Logistics Limited" },
      {
        property: "og:description",
        content:
          "Transportation, logistics, building construction and civil infrastructure services across Zambia and regional routes.",
      },
    ],
  }),
  component: ServicesPage,
});

const SECTIONS = [
  {
    id: "transportation",
    n: "01",
    title: "Transportation",
    intro:
      "Reliable point-to-point commercial logistics and efficient heavy-load transportation tailored to your operational and supply-chain requirements — with a strong focus on safety, reliability and professionalism.",
    items: [
      "Bulk cargo transportation",
      "General cargo transportation",
      "Heavy-duty haulage",
      "Long-distance transportation",
      "Domestic distribution",
      "Regional and cross-border transportation",
      "Construction material transportation",
      "Mining and industrial freight",
    ],
  },
  {
    id: "logistics",
    n: "02",
    title: "Logistics",
    intro:
      "We coordinate the movement and delivery of goods from origin to destination, helping clients manage their transportation requirements efficiently.",
    items: [
      "Transport planning",
      "Route planning",
      "Fleet coordination",
      "Load scheduling",
      "Dispatch coordination",
      "Distribution management",
      "Delivery coordination",
      "Final-mile delivery",
      "Transport monitoring",
    ],
  },
  {
    id: "building-construction",
    n: "03",
    title: "Building Construction",
    intro:
      "Construction services for residential, commercial, industrial and institutional developments — covering new construction, extensions and refurbishment works.",
    items: [
      "Residential construction",
      "Commercial buildings",
      "Office and institutional buildings",
      "Industrial buildings and workshops",
      "Warehouses and storage facilities",
      "Building extensions and renovations",
      "Refurbishment works",
    ],
  },
  {
    id: "civil-infrastructure",
    n: "04",
    title: "Civil & Infrastructure",
    intro:
      "Civil and infrastructure support for developments, construction projects and related works — from earthworks to completed structures.",
    items: [
      "Earthworks and site preparation",
      "Roads and access works",
      "Drainage and stormwater works",
      "Culverts and related structures",
      "Site development",
      "Infrastructure works",
      "Material and aggregate works",
      "Project and site support",
    ],
  },
];

function ServiceSection({ section, flip }: { section: (typeof SECTIONS)[number]; flip?: boolean }) {
  return (
    <Reveal>
      <article
        id={section.id}
        className={`grid scroll-mt-24 items-start gap-8 border-t border-border py-16 md:grid-cols-2 ${
          flip ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <span className="text-4xl text-primary">{section.n}</span>
          <h2 className="mt-2 text-4xl text-foreground">{section.title}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{section.intro}</p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enquire About This Service
          </Link>
        </div>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {section.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function ServicesPage() {
  return (
    <>
      <section className="bg-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Our Services</p>
          <h1 className="mt-2 text-4xl text-background md:text-5xl">
            Structured for commercial, industrial and project-based clients
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <ServiceSection section={SECTIONS[0]} />
        <ServiceSection section={SECTIONS[1]} flip />

        <Reveal>
          <article id={SECTIONS[2].id} className="grid scroll-mt-24 items-start gap-8 border-t border-border py-16 md:grid-cols-2">
            <div>
              <span className="text-4xl text-primary">{SECTIONS[2].n}</span>
              <h2 className="mt-2 text-4xl text-foreground">{SECTIONS[2].title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{SECTIONS[2].intro}</p>
              <Link
                to="/contact"
                className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Enquire About This Service
              </Link>
            </div>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {SECTIONS[2].items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article id={SECTIONS[3].id} className="scroll-mt-24 border-t border-border py-16">
            <div className="grid items-start gap-8 md:grid-cols-2">
              <div>
                <span className="text-4xl text-primary">{SECTIONS[3].n}</span>
                <h2 className="mt-2 text-4xl text-foreground">{SECTIONS[3].title}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{SECTIONS[3].intro}</p>
                <Link
                  to="/contact"
                  className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Enquire About This Service
                </Link>
              </div>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={civilWorks}
                  alt="Civil works: excavator shaping a road embankment with drainage culverts"
                  className="aspect-[16/10] w-full object-cover"
                  width={1600}
                  height={1000}
                  loading="lazy"
                />
              </div>
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              {SECTIONS[3].items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>

      <CTABand />
    </>
  );
}
