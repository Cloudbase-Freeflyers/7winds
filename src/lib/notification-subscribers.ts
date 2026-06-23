import { getDb } from "@/lib/mongodb";
import type {
  NotificationSubscriberDoc,
  NotificationSubscriberStatus,
} from "@/types/notifications";

let indexesReady: Promise<void> | null = null;

function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      await db
        .collection<NotificationSubscriberDoc>("notification_subscribers")
        .createIndex({ email: 1 }, { unique: true });
      await db
        .collection<NotificationSubscriberDoc>("notification_subscribers")
        .createIndex({ status: 1, createdAt: -1 });
    })();
  }
  return indexesReady;
}

export async function listNotificationSubscribers(
  status?: NotificationSubscriberStatus
) {
  await ensureIndexes();
  const db = await getDb();
  const filter = status ? { status } : {};
  return db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getApprovedNotificationEmails(): Promise<string[]> {
  await ensureIndexes();
  const db = await getDb();
  const rows = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .find({ status: "approved" })
    .project({ email: 1 })
    .toArray();
  return rows.map((r) => r.email);
}

export async function requestNotificationSubscription(params: {
  email: string;
  name?: string;
}) {
  await ensureIndexes();
  const db = await getDb();
  const email = params.email.trim().toLowerCase();
  const existing = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .findOne({ email });

  if (existing?.status === "approved") {
    return { ok: true as const, status: "approved" as const };
  }
  if (existing?.status === "pending") {
    return { ok: true as const, status: "pending" as const };
  }

  const now = new Date();
  if (existing?.status === "rejected") {
    await db.collection<NotificationSubscriberDoc>("notification_subscribers").updateOne(
      { email },
      {
        $set: {
          name: params.name || existing.name,
          status: "pending",
          updatedAt: now,
        },
        $unset: { approvedAt: "" },
      }
    );
    return { ok: true as const, status: "pending" as const, reRequested: true };
  }

  await db.collection<NotificationSubscriberDoc>("notification_subscribers").insertOne({
    email,
    name: params.name,
    status: "pending",
    createdAt: now,
  });

  return { ok: true as const, status: "pending" as const };
}

export async function updateNotificationSubscriber(
  id: string,
  status: NotificationSubscriberStatus
) {
  await ensureIndexes();
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) return null;

  const now = new Date();
  const updates: Partial<NotificationSubscriberDoc> = {
    status,
    updatedAt: now,
  };
  if (status === "approved") {
    updates.approvedAt = now;
  }

  const result = await db
    .collection<NotificationSubscriberDoc>("notification_subscribers")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: updates,
        ...(status !== "approved" ? { $unset: { approvedAt: "" } } : {}),
      },
      { returnDocument: "after" }
    );

  return result;
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
