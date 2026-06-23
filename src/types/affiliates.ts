import type { ObjectId } from "mongodb";

export type AffiliateStatus = "active" | "inactive";
export type CommissionType = "percent" | "fixed";
export type PayoutStatus = "none" | "pending" | "paid";

export interface AffiliateDoc {
  _id?: ObjectId;
  code: string;
  name: string;
  email?: string;
  passwordHash?: string;
  phone?: string;
  commissionRate: number;
  commissionType: CommissionType;
  status: AffiliateStatus;
  payoutStatus: PayoutStatus;
  totalPaid: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AffiliateEventType =
  | "visit"
  | "lead"
  | "voucher"
  | "whatsapp_click";

export interface AffiliateEventDoc {
  _id?: ObjectId;
  affiliateId: ObjectId;
  affiliateCode: string;
  type: AffiliateEventType;
  metadata?: {
    leadId?: string;
    voucherId?: string;
    package?: string;
    label?: string;
    paid?: boolean;
  };
  createdAt: Date;
}

export interface AffiliateStats {
  visits: number;
  leads: number;
  vouchers: number;
  whatsappClicks: number;
  /** Count of confirmed paid orders attributed to this affiliate. */
  paidOrders: number;
  /** Sum (₪) of confirmed paid order amounts — the commission basis. */
  referredRevenue: number;
  /** Commission earned on referredRevenue, via the monthly-volume schedule. */
  estimatedEarnings: number;
  pendingBalance: number;
}
