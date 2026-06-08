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
  affiliateCode: z.string().trim().max(40).optional().or(z.literal("")),
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
  affiliateCode: z.string().trim().max(40).optional().or(z.literal("")),
});

export type VoucherInput = z.infer<typeof voucherSchema>;

export function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

export const affiliateCreateSchema = z.object({
  name: z.string().trim().min(2, "נא להזין שם").max(80),
  code: z
    .string()
    .trim()
    .min(2, "קוד קצר מדי")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "קוד יכול להכיל אותיות אנגליות קטנות, מספרים ומקפים בלבד"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  commissionRate: z.coerce.number().min(0).max(100000),
  commissionType: z.enum(["percent", "fixed"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const affiliateUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  commissionRate: z.coerce.number().min(0).max(100000).optional(),
  commissionType: z.enum(["percent", "fixed"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  payoutStatus: z.enum(["none", "pending", "paid"]).optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const affiliatePayoutSchema = z.object({
  amount: z.coerce.number().positive("סכום חייב להיות חיובי"),
  payoutStatus: z.enum(["pending", "paid"]).default("paid"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
