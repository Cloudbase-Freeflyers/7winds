import type { ObjectId } from "mongodb";

export type LeadStatus =
  | "new"
  | "contacted"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface LeadDoc {
  _id?: ObjectId;
  name: string;
  phone: string;
  message?: string;
  source: "contact" | "accessibility";
  status?: LeadStatus;
  createdAt: Date;
  updatedAt?: Date;
  userAgent?: string;
  referrer?: string;
  affiliateId?: string;
  affiliateCode?: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type VoucherAdminStatus =
  | "new"
  | "in_progress"
  | "sent"
  | "completed"
  | "cancelled";

export interface VoucherDoc {
  _id?: ObjectId;
  orderId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  recipientName?: string;
  occasion?: string;
  package: "10min" | "20min" | "acro" | "golan" | "gilboa" | "media" | "test";
  notes?: string;
  orderType?: "voucher" | "direct";
  bookingAudience?: "solo" | "group";
  flightCount?: number;
  videoDiscount?: number;
  percentDiscount?: number;
  percentRate?: number;
  amount?: number;
  paymentStatus?: PaymentStatus;
  status?: VoucherAdminStatus;
  icountConfirmationCode?: string;
  icountDocNum?: number;
  paidAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  affiliateId?: string;
  affiliateCode?: string;
}
