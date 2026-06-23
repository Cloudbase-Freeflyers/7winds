import type { ObjectId } from "mongodb";

export type NotificationSubscriberStatus = "pending" | "approved" | "rejected";

export interface NotificationSubscriberDoc {
  _id?: ObjectId;
  email: string;
  name?: string;
  status: NotificationSubscriberStatus;
  createdAt: Date;
  updatedAt?: Date;
  approvedAt?: Date;
}
