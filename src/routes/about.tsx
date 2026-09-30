import { createFileRoute } from "@tanstack/react-router";
import { CTABand } from "@/components/shared";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Namutek Logistics Limited" },
      {
        name: "description",
        content:
          "Namutek Logistics Limited is a Zambian company providing transportation, logistics and construction services. Established 2018, based in Foxdale, Lusaka.",
      },
      { property: "og:title", content: "About Us — Namutek Logistics Limited" },
      {
        property: "og:description",
        content:
          "A Zambian transportation, logistics and construction company built on integrity, accountability and professionalism.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { name: "Passion", meaning: "We care about every assignment and treat each client's cargo and project as our own." },
  { name: "Precision", meaning: "We plan routes, loads and schedules carefully so delivery is accurate and on time." },
  { name: "Integrity", meaning: "We are honest in our pricing, our communication and our commitments." },
  { name: "Innovation", meaning: "We use modern tools and practical ideas to find effective, competitive solutions." },
  { name: "Professionalism", meaning: "We work with discipline, safety and accountability on every site and every road." },
];

const GLANCE = [
  ["Company name", "Namutek Logistics Limited"],
  ["Head office", "Plot No. 3074M off Zambezi Road, Foxdale, Lusaka, Zambia"],
  ["Core service areas", "Transportation, Logistics, Building Construction, Civil & Infrastructure"],
  ["Operating area", "Zambia and selected regional markets"],
  ["Registration number", "120251021409"],
  ["Year established", "2018"],
  ["Managing Director", "Musonda Chiinga"],
];

function AboutPage() {
  return (
    <>
      <section className="bg-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">About Us</p>
          <h1 className="mt-2 text-4xl text-background md:text-5xl">
            Keeping businesses supplied and projects moving
          </h1>
        </div>
      </section>

      {/* Message from the MD */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="rounded-lg border border-border bg-card p-8 md:p-12">
            <p className="text-3xl text-primary">“</p>
            <blockquote className="mt-2 space-y-4 text-lg leading-relaxed text-foreground">
              <p>
                At Namutek Logistics Limited, we believe that effective logistics is
                about more than transporting goods. It is about keeping businesses
                supplied, projects moving and operations running.
              </p>
              <p>
                Our business was built around the need for dependable transportation
                and practical logistics solutions. Today, we support clients across
                freight transportation, heavy-duty haulage, supply chain coordination
                and construction support, serving requirements within Zambia and
                selected regional markets.
              </p>
              <p>
                As we continue to grow, our focus is on strengthening our
                capabilities, building lasting business relationships and becoming a
                trusted partner to companies across key sectors of the Zambian and
                regional economy.
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-bold text-foreground">Musonda Chiinga</p>
              <p className="text-sm text-muted-foreground">
                Managing Director, Namutek Logistics Limited
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Who we are */}
      <section className="bg-muted/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-20 md:grid-cols-3">
          {[
            {
              title: "Who we are",
              body: "Namutek Logistics Limited is a Zambian company providing transportation, logistics and construction services to businesses and organisations. We specialise in the movement of goods and materials across Zambia and regional routes.",
            },
            {
              title: "What we do",
              body: "We move goods, materials and equipment, coordinate their movement from origin to destination, and support construction and infrastructure projects with the transportation and site services they require.",
            },
            {
              title: "How we work",
              body: "Our work is centred on dependable services that help clients move goods and keep projects progressing — with professionalism, safety, reliability and efficient service on every assignment.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <h2 className="text-2xl text-primary">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-lg border-t-4 border-primary bg-card p-8">
              <h2 className="text-3xl text-foreground">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To be the leading provider of safe and reliable goods transportation
                solutions, and a trusted delivery partner for construction and
                infrastructure projects, driving progress and prosperity in Zambia
                and beyond.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-lg border-t-4 border-foreground bg-card p-8">
              <h2 className="text-3xl text-foreground">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To safely deliver goods to our customers and support their projects,
                ensuring their operations run smoothly — upholding the highest
                standards of safety, reliability and professionalism in every aspect
                of our business.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-16 text-3xl text-foreground">Our Values</h2>
        </Reveal>
        <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
          {VALUES.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.05}>
              <div className="grid gap-1 p-5 md:grid-cols-3 md:gap-6">
                <p className="font-bold uppercase tracking-wide text-primary">{v.name}</p>
                <p className="text-sm leading-relaxed text-muted-foreground md:col-span-2">{v.meaning}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Company at a glance */}
      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <h2 className="text-3xl text-foreground">Company at a Glance</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {GLANCE.map(([label, value]) => (
                <div key={label} className="grid p-4 md:grid-cols-3 md:gap-6">
                  <dt className="text-sm font-bold uppercase tracking-wide text-foreground">{label}</dt>
                  <dd className="text-sm text-muted-foreground md:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
