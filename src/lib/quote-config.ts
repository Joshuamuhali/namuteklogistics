// Local quotation configuration. All prices are INDICATIVE averages of the
// Zambian market (ZMW) and are always shown as a range; Namutek confirms the
// official quotation. Edit the numbers here to update the whole quote pathway.

export type DivisionKey = "freight" | "construction" | "civil" | "plant";

export const DIVISIONS: { key: DivisionKey; label: string; desc: string }[] = [
  { key: "freight", label: "Freight & Transport", desc: "Commercial cargo, general freight and heavy haulage." },
  { key: "construction", label: "Building Construction", desc: "Building works and construction projects." },
  { key: "civil", label: "Civil Infrastructure", desc: "Civil engineering and infrastructure projects." },
  { key: "plant", label: "Fleet & Plant Hire", desc: "Machinery and equipment hire." },
];

export const FREIGHT_STREAMS = [
  "Bulk Cargo Transportation",
  "General Commercial Freight",
  "Heavy-Duty Machinery Haulage",
  "Long-Distance National Transport",
  "Regional & Cross-Border Freight",
  "Mining & Industrial Haulage",
  "Construction Aggregate Transport",
];

export const CARGO_BANDS = [
  { key: "1-10", label: "1–10 Tons", note: "Light Commercial", ratePerKm: 28, minimum: 3500 },
  { key: "10-30", label: "10–30 Tons", note: "Standard Haulage", ratePerKm: 45, minimum: 6500 },
  { key: "30-60", label: "30–60 Tons", note: "Heavy Freight", ratePerKm: 70, minimum: 12000 },
  { key: "60+", label: "60+ Tons", note: "Abnormal / Heavy Plant", ratePerKm: 115, minimum: 25000 },
] as const;

// Approximate road distance from Lusaka (km) and corridor grouping.
export const LOCATIONS = [
  { key: "lusaka", label: "Lusaka (Headquarters)", km: 0, corridor: "hub" },
  { key: "ndola", label: "Ndola (Copperbelt)", km: 320, corridor: "north" },
  { key: "kitwe", label: "Kitwe (Copperbelt)", km: 360, corridor: "north" },
  { key: "solwezi", label: "Solwezi (North-Western)", km: 560, corridor: "north" },
  { key: "chingola", label: "Chingola", km: 410, corridor: "north" },
  { key: "mufulira", label: "Mufulira", km: 375, corridor: "north" },
  { key: "livingstone", label: "Livingstone", km: 480, corridor: "south" },
  { key: "chirundu", label: "Chirundu Border", km: 135, corridor: "southeast", border: true },
  { key: "nakonde", label: "Nakonde Border", km: 1000, corridor: "northeast", border: true },
  { key: "kazungula", label: "Kazungula Border", km: 540, corridor: "south", border: true },
  { key: "kasumbalesa", label: "Kasumbalesa Border", km: 430, corridor: "north", border: true },
  { key: "sadc", label: "Regional (SADC Corridor)", km: 0, corridor: "regional", border: true },
  { key: "other", label: "Other / Custom Location", km: 0, corridor: "custom" },
] as const;

export type LocationKey = (typeof LOCATIONS)[number]["key"];
export const locationByKey = (k?: string) => LOCATIONS.find((l) => l.key === k);

export const CROSS_BORDER_SURCHARGE = 0.15;
export const RANGE_SPREAD = 0.12; // ± shown around the midpoint

/** Approximate km between two configured locations, or null if unknown. */
export function routeDistance(a?: string, b?: string): number | null {
  const A = locationByKey(a);
  const B = locationByKey(b);
  if (!A || !B || A.key === B.key) return null;
  if (["regional", "custom"].includes(A.corridor) || ["regional", "custom"].includes(B.corridor)) return null;
  if (A.corridor === B.corridor && A.corridor !== "hub") return Math.abs(A.km - B.km) + 25;
  return A.km + B.km;
}

export function freightEstimate(band: string | undefined, origin?: string, dest?: string, loads = 1) {
  const b = CARGO_BANDS.find((c) => c.key === band);
  const km = routeDistance(origin, dest);
  if (!b || km === null) return null;
  const border = !!(locationByKey(origin) as { border?: boolean } | undefined)?.border ||
    !!(locationByKey(dest) as { border?: boolean } | undefined)?.border;
  let mid = Math.max(b.minimum, km * b.ratePerKm);
  if (border) mid *= 1 + CROSS_BORDER_SURCHARGE;
  mid *= Math.max(1, loads);
  return { km, border, min: mid * (1 - RANGE_SPREAD), max: mid * (1 + RANGE_SPREAD) };
}

export const BUILDING_TYPES = [
  { key: "residential", label: "Residential", perM2: [6500, 9500] },
  { key: "commercial", label: "Commercial", perM2: [8500, 13000] },
  { key: "industrial", label: "Industrial / warehouse", perM2: [5500, 9000] },
  { key: "institutional", label: "Institutional", perM2: [8000, 12000] },
  { key: "refurb", label: "Extension / refurbishment", perM2: [2500, 5000] },
] as const;

export const PROJECT_STAGES = ["Idea / planning", "Designs ready", "Approved & ready to start", "Under way — need support"];

export const CIVIL_TYPES = [
  { key: "earthworks", label: "Earthworks & excavation", unit: "m³", rate: [85, 150] },
  { key: "gravel-road", label: "Gravel road construction", unit: "km", rate: [1_200_000, 2_500_000] },
  { key: "drainage", label: "Drainage & culverts", unit: "m", rate: [1800, 4200] },
  { key: "site-dev", label: "Site clearing & development", unit: "m²", rate: [25, 60] },
] as const;

export const EQUIPMENT = [
  { key: "excavator", label: "Excavator (20–30t)", perDay: [6000, 8500] },
  { key: "tlb", label: "TLB / backhoe loader", perDay: [3500, 5000] },
  { key: "loader", label: "Front-end loader", perDay: [5500, 7500] },
  { key: "grader", label: "Motor grader", perDay: [7000, 9500] },
  { key: "roller", label: "Vibratory roller", perDay: [4000, 5500] },
  { key: "tipper", label: "Tipper truck", perDay: [4000, 5500] },
  { key: "lowbed", label: "Low-bed trailer & prime mover", perDay: [9000, 13000] },
] as const;

export const formatZMW = (n: number) =>
  "K " + Math.round(n / 100) * 100 >= "" ? `K ${(Math.round(n / 100) * 100).toLocaleString("en-ZM")}` : "";
