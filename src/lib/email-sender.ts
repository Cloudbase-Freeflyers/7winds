import { getDb } from "@/lib/mongodb";
import type { EmailSenderDoc } from "@/types/email-sender";

const DOC_ID = "default" as const;

export async function getConnectedEmailSender(): Promise<EmailSenderDoc | null> {
  const db = await getDb();
  const doc = await db
    .collection<EmailSenderDoc>("email_sender")
    .findOne({ _id: DOC_ID });
  if (!doc?.refreshToken || !doc.senderEmail) return null;
  return doc;
}

export async function saveConnectedEmailSender(params: {
  senderEmail: string;
  refreshToken: string;
}) {
  const db = await getDb();
  const now = new Date();
  await db.collection<EmailSenderDoc>("email_sender").updateOne(
    { _id: DOC_ID },
    {
      $set: {
        senderEmail: params.senderEmail.trim().toLowerCase(),
        refreshToken: params.refreshToken,
        connectedAt: now,
        updatedAt: now,
      },
    },
    { upsert: true }
  );
}

export async function clearConnectedEmailSender() {
  const db = await getDb();
  await db.collection<EmailSenderDoc>("email_sender").deleteOne({ _id: DOC_ID });
}
