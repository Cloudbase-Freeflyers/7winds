import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "התראות על לידים",
  robots: { index: false, follow: false },
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
