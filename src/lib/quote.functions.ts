import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const SERVICE_TYPES = ["freight", "haulage", "logistics", "construction"] as const;

const quoteSchema = z.object({
  serviceType: z.enum(SERVICE_TYPES),
  origin: z.string().trim().max(200).optional(),
  destination: z.string().trim().max(200).optional(),
  contactName: z.string().trim().min(2, "Please enter your name").max(120),
  companyName: z.string().trim().max(160).optional(),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255)
    .optional()
    .or(z.literal("")),
  projectDetails: z
    .string()
    .trim()
    .min(10, "Please describe your requirement in a little more detail")
    .max(2000),
  extra: z.record(z.string().max(80), z.string().max(500)).default({}),
});

export type QuoteRequestInput = z.infer<typeof quoteSchema>;

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { error } = await supabase.from("quote_requests").insert({
      service_type: data.serviceType,
      origin: data.origin || null,
      destination: data.destination || null,
      contact_name: data.contactName,
      company_name: data.companyName || null,
      phone: data.phone,
      email: data.email || null,
      project_details: data.projectDetails,
      extra: data.extra,
    });

    if (error) {
      throw new Error("Could not submit your request. Please try again or call us.");
    }

    return { ok: true };
  });
