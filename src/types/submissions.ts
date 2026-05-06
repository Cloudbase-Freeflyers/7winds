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
}

export interface VoucherDoc {
  _id?: ObjectId;
  buyerName: string;
  buyerPhone: string;
  recipientName?: string;
  occasion?: string;
  package: "10min" | "20min" | "acro" | "golan" | "gilboa";
  notes?: string;
  createdAt: Date;
}
