import type { ObjectId } from "mongodb";

export interface LeadDoc {
  _id?: ObjectId;
  name: string;
  phone: string;
  message?: string;
  source: "contact" | "accessibility";
  createdAt: Date;
  userAgent?: string;
  referrer?: string;
  affiliateId?: string;
  affiliateCode?: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export interface VoucherDoc {
  _id?: ObjectId;
  orderId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  recipientName?: string;
  occasion?: string;
  package: "10min" | "20min" | "acro" | "golan" | "gilboa" | "media";
  notes?: string;
  orderType?: "voucher" | "direct";
  bookingAudience?: "solo" | "group";
  amount?: number;
  paymentStatus?: PaymentStatus;
  icountConfirmationCode?: string;
  icountDocNum?: number;
  paidAt?: Date;
  createdAt: Date;
  affiliateId?: string;
  affiliateCode?: string;
}
