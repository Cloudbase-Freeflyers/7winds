import { z } from "zod";

const phoneRegex = /^[\d\s+\-()]{7,20}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "נא להזין שם מלא").max(80),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "מספר טלפון לא תקין"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  source: z.enum(["contact", "accessibility"]).default("contact"),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const voucherSchema = z.object({
  buyerName: z.string().trim().min(2, "נא להזין שם מלא").max(80),
  buyerPhone: z
    .string()
    .trim()
    .regex(phoneRegex, "מספר טלפון לא תקין"),
  recipientName: z.string().trim().max(80).optional().or(z.literal("")),
  occasion: z.string().trim().max(80).optional().or(z.literal("")),
  package: z.enum(["10min", "20min", "acro", "golan", "gilboa"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type VoucherInput = z.infer<typeof voucherSchema>;

export function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}
