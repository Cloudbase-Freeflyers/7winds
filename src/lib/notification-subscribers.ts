import { getDb } from "@/lib/mongodb";
import {
  defaultNotificationPreferences,
  mergePreferences,
  normalizePreferences,
  type NotificationPreferences,
  type NotificationSubscriberDoc,
  type NotificationSubscriberStatus,
  type NotificationTopic,
} from "@/types/notifications";

let indexesReady: Promise<void> | null = null;

function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const coll = db.collection<NotificationSubscriberDoc>("notification_subscribers");
      await mergeDuplicateSubscribers(coll);
      await backfillMissingPreferences(coll);
      await coll.createIndex({ email: 1 }, { unique: true });
      await coll.createIndex({ status: 1, createdAt: -1 });
    })();
  }
  return indexesReady;
}

/**
 * Legacy docs created before the `preferences` field existed have no
 * preferences at all, so topic queries like `{ "preferences.leads": true }`
 * never match them — an approved subscriber would silently receive nothing and
 * not be counted. Backfill defaults so every doc is queryable.
 */
async function backfillMissingPreferences(
  coll: import("mongodb").Collection<NotificationSubscriberDoc>
) {
  await coll.updateMany(
    { preferences: { $exists: false } },
    { $set: { preferences: defaultNotificationPreferences(), updatedAt: new Date() } }
  );
}

const STATUS_RANK: Record<NotificationSubscriberStatus, number> = {
  approved: 3,
  pending: 2,
  rejected: 1,
};

async function mergeDuplicateSubscribers(
  coll: import("mongodb").Collection<NotificationSubscriberDoc>
) {
  const dupes = await coll
    .aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$email", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  for (const { _id: email } of dupes) {
    const rows = await coll.find({ email }).sort({ createdAt: 1 }).toArray();
    if (rows.length < 2) continue;

    const bestStatus = rows.reduce((best, row) =>
      STATUS_RANK[row.status] > STATUS_RANK[best.status] ? row : best
    ).status;

    const preferences = rows.reduce(
      (acc, row) =>
        mergePreferences(acc, normalizePreferences(row.preferences)),
      defaultNotificationPreferences()
    );

    const primary = rows.find((r) => r.status === bestStatus) ?? rows[0];
    const approvedAt = rows.find((r) => r.approvedAt)?.approvedAt;

    await coll.updateOne(
      { _id: primary._id },
      {
        $set: {
          status: bestStatus,
          preferences,
          name: primary.name || rows.find((r) => r.name)?.name,
          ...(bestStatus === "approved"
            ? { approvedAt: approvedAt ?? new Date() }
            : {}),
          updatedAt: new Date(),
        },
        ...(bestStatus !== "approved" ? { $unset: { approvedAt: "" } } : {}),
      }
    );

    const removeIds = rows
      .filter((r) => String(r._id) !== String(primary._id))
      .map((r) => r._id!);
    if (removeIds.length) {
      await coll.deleteMany({ _id: { $in: removeIds } });
    }
  }
}

function docWithDefaults(doc: NotificationSubscriberDoc): NotificationSubscriberDoc {
  return {
    ...doc,
    preferences: normalizePreferences(doc.preferences),
  };
}

export async function listNotificationSubscribers(
  status?: NotificationSubscriberStatus
) {
  await ensureIndexes();
  const db = await getDb();
  const filter = status ? { status } : {};
  const rows = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  return rows.map(docWithDefaults);
}

export async function getApprovedEmailsForTopic(
  topic: NotificationTopic
): Promise<string[]> {
  await ensureIndexes();
  const db = await getDb();
  const rows = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .find({
      status: "approved",
      [`preferences.${topic}`]: true,
    })
    .project({ email: 1 })
    .toArray();
  return rows.map((r) => r.email);
}

/** @deprecated use getApprovedEmailsForTopic */
export async function getApprovedNotificationEmails(): Promise<string[]> {
  return getApprovedEmailsForTopic("leads");
}

export async function requestNotificationSubscription(params: {
  email: string;
  name?: string;
  preferences?: Partial<NotificationPreferences>;
}) {
  await ensureIndexes();
  const db = await getDb();
  const email = params.email.trim().toLowerCase();
  const requested = normalizePreferences(
    mergePreferences(defaultNotificationPreferences(), params.preferences ?? {})
  );

  const existing = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .findOne({ email });

  const now = new Date();

  if (existing?.status === "approved") {
    const preferences = mergePreferences(
      normalizePreferences(existing.preferences),
      requested
    );
    await db.collection<NotificationSubscriberDoc>("notification_subscribers").updateOne(
      { email },
      {
        $set: {
          name: params.name || existing.name,
          preferences,
          updatedAt: now,
        },
      }
    );
    return {
      ok: true as const,
      status: "approved" as const,
      message: "העדפות ההתראות עודכנו.",
    };
  }

  if (existing?.status === "pending") {
    const preferences = mergePreferences(
      normalizePreferences(existing.preferences),
      requested
    );
    await db.collection<NotificationSubscriberDoc>("notification_subscribers").updateOne(
      { email },
      {
        $set: {
          name: params.name || existing.name,
          preferences,
          updatedAt: now,
        },
      }
    );
    return {
      ok: true as const,
      status: "pending" as const,
      message: "הבקשה כבר ממתינה — העדפות ההתראות עודכנו.",
    };
  }

  if (existing?.status === "rejected") {
    await db.collection<NotificationSubscriberDoc>("notification_subscribers").updateOne(
      { email },
      {
        $set: {
          name: params.name || existing.name,
          preferences: requested,
          status: "pending",
          updatedAt: now,
        },
        $unset: { approvedAt: "" },
      }
    );
    return {
      ok: true as const,
      status: "pending" as const,
      message: "הבקשה נשלחה מחדש — ממתין לאישור מנהל.",
    };
  }

  await db.collection<NotificationSubscriberDoc>("notification_subscribers").insertOne({
    email,
    name: params.name,
    status: "pending",
    preferences: requested,
    createdAt: now,
  });

  return {
    ok: true as const,
    status: "pending" as const,
    message: "הבקשה נשלחה — ממתין לאישור מנהל (פעם אחת לכל אימייל).",
  };
}

/**
 * Admin-side: add (or re-approve) an email directly as an approved subscriber.
 * Unlike requestNotificationSubscription this skips the pending step, so the
 * owner can put their own address on the list without the public subscribe flow.
 */
export async function addApprovedSubscriber(params: {
  email: string;
  name?: string;
  preferences?: Partial<NotificationPreferences>;
}) {
  await ensureIndexes();
  const db = await getDb();
  const coll = db.collection<NotificationSubscriberDoc>("notification_subscribers");
  const email = params.email.trim().toLowerCase();
  const requested = normalizePreferences(
    mergePreferences(defaultNotificationPreferences(), params.preferences ?? {})
  );
  const now = new Date();

  const existing = await coll.findOne({ email });
  const preferences = existing
    ? mergePreferences(normalizePreferences(existing.preferences), requested)
    : requested;
  const name = params.name?.trim() || existing?.name;

  const set: Partial<NotificationSubscriberDoc> = {
    status: "approved",
    preferences,
    approvedAt: existing?.approvedAt ?? now,
    updatedAt: now,
  };
  if (name) set.name = name;

  await coll.updateOne(
    { email },
    { $set: set, $setOnInsert: { email, createdAt: now } },
    { upsert: true }
  );

  const doc = await coll.findOne({ email });
  return doc ? docWithDefaults(doc) : null;
}

export async function updateNotificationSubscriber(
  id: string,
  updates: {
    status?: NotificationSubscriberStatus;
    preferences?: Partial<NotificationPreferences>;
  }
) {
  await ensureIndexes();
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) return null;

  const existing = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const now = new Date();
  const set: Partial<NotificationSubscriberDoc> = { updatedAt: now };

  if (updates.status) {
    set.status = updates.status;
    if (updates.status === "approved") {
      set.approvedAt = now;
    }
  }

  if (updates.preferences) {
    set.preferences = mergePreferences(
      normalizePreferences(existing.preferences),
      updates.preferences
    );
  } else if (!existing.preferences) {
    // Legacy doc with no preferences — write defaults so it stays queryable.
    set.preferences = defaultNotificationPreferences();
  }

  const result = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: set,
        ...(updates.status && updates.status !== "approved"
          ? { $unset: { approvedAt: "" } }
          : {}),
      },
      { returnDocument: "after" }
    );

  return result ? docWithDefaults(result) : null;
}

export async function deleteNotificationSubscriber(id: string) {
  await ensureIndexes();
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) return false;

  const result = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
