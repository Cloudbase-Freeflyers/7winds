export type NotificationTopic = "leads" | "vouchers" | "payments";

export type NotificationSubscriberStatus = "pending" | "approved" | "rejected";

export type NotificationPreferences = Record<NotificationTopic, boolean>;

export interface NotificationSubscriberDoc {
  _id?: import("mongodb").ObjectId;
  email: string;
  name?: string;
  status: NotificationSubscriberStatus;
  preferences: NotificationPreferences;
  createdAt: Date;
  updatedAt?: Date;
  approvedAt?: Date;
}

export const NOTIFICATION_TOPICS: {
  id: NotificationTopic;
  label: string;
  description: string;
  active: boolean;
}[] = [
  {
    id: "leads",
    label: "לידים",
    description: "פניות חדשות מהאתר ומקמפיינים",
    active: true,
  },
  {
    id: "vouchers",
    label: "שוברים",
    description: "בקשות שובר מתנה",
    active: true,
  },
  {
    id: "payments",
    label: "תשלומים",
    description: "אישורי תשלום",
    active: true,
  },
];

export function defaultNotificationPreferences(
  overrides?: Partial<NotificationPreferences>
): NotificationPreferences {
  return {
    leads: overrides?.leads ?? true,
    vouchers: overrides?.vouchers ?? false,
    payments: overrides?.payments ?? false,
  };
}

export function normalizePreferences(
  raw?: Partial<NotificationPreferences> | null
): NotificationPreferences {
  if (!raw) return defaultNotificationPreferences();
  return {
    leads: Boolean(raw.leads),
    vouchers: Boolean(raw.vouchers),
    payments: Boolean(raw.payments),
  };
}

export function mergePreferences(
  base: NotificationPreferences,
  patch: Partial<NotificationPreferences>
): NotificationPreferences {
  return {
    leads: patch.leads ?? base.leads,
    vouchers: patch.vouchers ?? base.vouchers,
    payments: patch.payments ?? base.payments,
  };
}

export function requestedTopicLabels(prefs: NotificationPreferences): string {
  return NOTIFICATION_TOPICS.filter((t) => prefs[t.id])
    .map((t) => t.label)
    .join(", ");
}
