import type { LeadStatus, PaymentStatus, VoucherAdminStatus } from "@/types/submissions";

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "חדש" },
  { value: "contacted", label: "נוצר קשר" },
  { value: "scheduled", label: "נקבע טיסה" },
  { value: "completed", label: "הושלם" },
  { value: "cancelled", label: "בוטל" },
];

export const VOUCHER_STATUS_OPTIONS: { value: VoucherAdminStatus; label: string }[] = [
  { value: "new", label: "חדש" },
  { value: "in_progress", label: "בטיפול" },
  { value: "sent", label: "שובר נשלח" },
  { value: "completed", label: "הושלם" },
  { value: "cancelled", label: "בוטל" },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "ממתין לתשלום" },
  { value: "paid", label: "שולם" },
  { value: "failed", label: "נכשל" },
  { value: "cancelled", label: "בוטל" },
];

export function leadStatusLabel(status?: LeadStatus) {
  return LEAD_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "חדש";
}

export function voucherStatusLabel(status?: VoucherAdminStatus) {
  return VOUCHER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "חדש";
}

export function paymentStatusLabel(status?: PaymentStatus) {
  return PAYMENT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "—";
}

export function leadStatusBadgeClass(status?: LeadStatus) {
  switch (status ?? "new") {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "contacted":
      return "bg-purple-100 text-purple-800";
    case "scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
  }
}

export function voucherStatusBadgeClass(status?: VoucherAdminStatus) {
  switch (status ?? "new") {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "sent":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
  }
}

export function paymentStatusBadgeClass(status?: PaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
