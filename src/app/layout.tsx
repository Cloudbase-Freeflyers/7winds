import type { Metadata, Viewport } from "next";
import { Heebo, Assistant, Rubik } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GA_ID, PIXEL_ID } from "@/lib/analytics";
import { BRAND } from "@/lib/constants";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1ABBEF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: "טיסת טנדם במצנח רחיפה | 7Winds",
    template: "%s | 7Winds",
  },
  description:
    "טיסת מצנח רחיפה זוגית עם מדריך מקצועי בארסוף, נתניה, רמת הגולן וגלבוע. מתאים גם כמתנה חווייתית.",
  keywords: [
    "טיסת טנדם",
    "מצנח רחיפה",
    "טיסת חוויה",
    "טיסת מצנח רחיפה",
    "שובר מתנה",
    "7Winds",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "7Winds Paragliding Club",
    title: "טיסת טנדם במצנח רחיפה | 7Winds",
    description:
      "טיסת מצנח רחיפה זוגית עם מדריך מקצועי – חוויה שלא תשכחו בחיים.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "טיסת טנדם במצנח רחיפה | 7Winds",
    description:
      "טיסת מצנח רחיפה זוגית עם מדריך מקצועי – חוויה שלא תשכחו בחיים.",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${assistant.variable} ${rubik.variable}`}
    >
      <body className="font-sans">
        {children}

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}

        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
