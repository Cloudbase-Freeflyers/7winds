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
  package: z.enum(["10min", "20min", "acro", "golan", "gilboa", "media"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  affiliateCode: z.string().trim().max(40).optional().or(z.literal("")),
});

export type VoucherInput = z.infer<typeof voucherSchema>;

const emailSchema = z
  .string()
  .trim()
  .email("כתובת אימייל לא תקינה")
  .max(120);

export const checkoutSchema = z.object({
  type: z.enum(["voucher", "direct"]),
  package: z.enum(["10min", "20min", "acro", "golan", "gilboa", "media"]),
  buyerName: z.string().trim().min(2, "נא להזין שם מלא").max(80),
  buyerPhone: z
    .string()
    .trim()
    .regex(phoneRegex, "מספר טלפון לא תקין"),
  buyerEmail: emailSchema,
  recipientName: z.string().trim().max(80).optional().or(z.literal("")),
  occasion: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  affiliateCode: z.string().trim().max(40).optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

const affiliateEmailSchema = z
  .string()
  .trim()
  .email("כתובת אימייל לא תקינה")
  .max(120);

const affiliatePasswordSchema = z
  .string()
  .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
  .max(128);

export const affiliateCreateSchema = z
  .object({
    name: z.string().trim().min(2, "נא להזין שם").max(80),
    code: z
      .string()
      .trim()
      .min(2, "קוד קצר מדי")
      .max(40)
      .regex(
        /^[a-z0-9-]+$/,
        "קוד יכול להכיל אותיות אנגליות קטנות, מספרים ומקפים בלבד"
      ),
    email: affiliateEmailSchema.optional().or(z.literal("")),
    password: affiliatePasswordSchema.optional().or(z.literal("")),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    commissionRate: z.coerce.number().min(0).max(100000),
    commissionType: z.enum(["percent", "fixed"]),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasEmail = !!data.email;
    const hasPassword = !!data.password;
    if (hasEmail !== hasPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "יש להזין גם אימייל וגם סיסמה לכניסת שותף",
        path: hasEmail ? ["password"] : ["email"],
      });
    }
  });

export const affiliateUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: affiliateEmailSchema.optional().or(z.literal("")),
  password: affiliatePasswordSchema.optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  commissionRate: z.coerce.number().min(0).max(100000).optional(),
  commissionType: z.enum(["percent", "fixed"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  payoutStatus: z.enum(["none", "pending", "paid"]).optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const affiliateLoginSchema = z.object({
  email: affiliateEmailSchema,
  password: z.string().min(1, "נא להזין סיסמה").max(128),
});

export const affiliatePayoutSchema = z.object({
  amount: z.coerce.number().positive("סכום חייב להיות חיובי"),
  payoutStatus: z.enum(["pending", "paid"]).default("paid"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
