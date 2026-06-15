export const BRAND = {
  name: "7Winds Paragliding Club",
  hebrewName: "7Winds — מועדון מצנחי רחיפה",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://7windsparagliding.com",
  /** Header, footer, and in-page branding */
  logo: "/logo.png",
  /** Browser tab, PWA, and social share preview */
  favicon: "/images/favicon_7winds.ico",
} as const;

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972515152637";
const rawPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0515152637";

export const CONTACT = {
  whatsappNumber: rawWhatsApp.replace(/[^\d]/g, ""),
  phoneDisplay: rawPhone,
  phoneTel: rawPhone.replace(/[^\d+]/g, ""),
} as const;

export const youtubeVideoId =
  process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "nKW4Dyv_uJ4";

/** Client-approved hero + explainer film (v2) */
export const HERO_FILM_VIDEO_ID = "4VjdoHoQMmE";

export function youtubeThumbnail(
  videoId: string,
  quality: "maxres" | "hq" = "maxres"
) {
  const file = quality === "maxres" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${videoId}/${file}.jpg`;
}

export const V2_IMAGES = {
  tandemOverWater: "/images/v2/tandem-hero-bg.png",
  tandemSeaVertical: "/images/v2/tandem-sea-vertical.png",
  fieldFlight: "/images/v2/field-flight-bg.png",
  fieldFlightVertical: "/images/v2/field-flight-vertical.png",
} as const;

/** Pre-filled WhatsApp messages — Hebrew only; business name appears in the chat header. */
export const WHATSAPP_MESSAGES = {
  tandem: "שלום! אשמח לקבל פרטים על טיסת טנדם",
  flight: "שלום! אשמח לקבל פרטים על טיסה",
  greeting: "שלום!",
  accessibility:
    "שלום! אני מתעניין/ת בטיסה מותאמת, נשמח לתיאום אישי",
} as const;

const LRI = "\u2066";
const PDI = "\u2069";

/** Keep Latin letters and numbers in correct order inside Hebrew RTL text. */
function bidiSafe(text: string): string {
  return text.replace(/[A-Za-z0-9][A-Za-z0-9_\-]*/g, (match) => `${LRI}${match}${PDI}`);
}

export function whatsappMessage(
  message: string,
  affiliateCode?: string | null
): string {
  let text = bidiSafe(message);
  if (affiliateCode) {
    text = `${text}\n\nפנייה דרך שותף: ${LRI}${affiliateCode}${PDI}`;
  }
  return text;
}

export function whatsappLink(
  message: string,
  affiliateCode?: string | null
) {
  const text = whatsappMessage(message, affiliateCode);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const PRICING_LOCATIONS = [
  {
    id: "arsuf-netanya",
    title: "ארסוף / נתניה",
    items: [
      { label: "10 דקות", price: "₪300" },
      { label: "20 דקות", price: "₪450" },
      { label: "טיסת אקרובטיקה עם פעלולים", price: "₪500" },
      { label: "תוספת צילום וידאו / תמונות", price: "₪150" },
    ],
  },
  {
    id: "golan-gilboa",
    title: "רמת הגולן / גלבוע",
    items: [{ label: "טיסת טנדם", price: "₪750" }],
  },
] as const;

export const PRICING_NOTES = [
  "הטיסות מתבצעות בהתאם לתנאי מזג האוויר",
  "אין צורך בניסיון קודם",
  "כל הטיסות מתבצעות עם מדריך מוסמך",
] as const;

export const VOUCHER_PACKAGES = [
  { value: "10min", label: "10 דקות בארסוף / נתניה — ₪300" },
  { value: "20min", label: "20 דקות בארסוף / נתניה — ₪450" },
  { value: "acro", label: "אקרובטיקה עם פעלולים — ₪500" },
  { value: "golan", label: "טיסת טנדם — רמת הגולן — ₪750" },
  { value: "gilboa", label: "טיסת טנדם — גלבוע — ₪750" },
] as const;

export type VoucherPackage = (typeof VOUCHER_PACKAGES)[number]["value"];

/** Direct-checkout packages (flights + add-ons) */
export type ProductPackage = VoucherPackage | "media" | "test";

export const PACKAGE_PRICES: Record<ProductPackage, number> = {
  "10min": 300,
  "20min": 450,
  acro: 500,
  golan: 750,
  gilboa: 750,
  media: 150,
  test: 5,
};

export const PACKAGE_INVOICE_DESCRIPTIONS: Record<ProductPackage, string> = {
  "10min": "שובר מתנה — 10 דקות ארסוף/נתניה — 7Winds",
  "20min": "שובר מתנה — 20 דקות ארסוף/נתניה — 7Winds",
  acro: "שובר מתנה — אקרובטיקה ארסוף/נתניה — 7Winds",
  golan: "שובר מתנה — טיסת טנדם רמת הגולן — 7Winds",
  gilboa: "שובר מתנה — טיסת טנדם גלבוע — 7Winds",
  media: "תוספת צילום וידאו / תמונות — 7Winds",
  test: "בדיקת תשלום — 7Winds (dev)",
};

export const PACKAGE_LABELS: Record<ProductPackage, string> = {
  "10min": "10 דקות בארסוף / נתניה — ₪300",
  "20min": "20 דקות בארסוף / נתניה — ₪450",
  acro: "אקרובטיקה עם פעלולים — ₪500",
  golan: "טיסת טנדם — רמת הגולן — ₪750",
  gilboa: "טיסת טנדם — גלבוע — ₪750",
  media: "תוספת צילום וידאו / תמונות — ₪150",
  test: "🧪 בדיקת תשלום — ₪5",
};

/** Dev-only checkout item — shown on /dev only */
export const DEV_TEST_PACKAGE = {
  value: "test" as const,
  label: "🧪 בדיקת תשלום — ₪5",
  price: "₪5",
};

export const VOUCHER_OCCASIONS = [
  "יום הולדת",
  "זוגות",
  "הפתעות",
  "מתנות לעובדים",
] as const;

export const LOCATIONS = ["ארסוף", "נתניה", "רמת הגולן", "גלבוע"] as const;

export const FLIGHT_STEPS = [
  "הגעה ותדריך קצר",
  "חיבור לציוד עם מדריך",
  "ריצה קצרה והמראה",
  "טיסה מעל הים או נופים פתוחים",
  "נחיתה רכה ובטוחה",
] as const;

export const FLIGHT_FEATURES = [
  "תחושת חופש ואדרנלין",
  "אפשרות לצילום במהלך הטיסה",
  "אפשרות לטיסת אקרובטיקה",
] as const;

export const WHY_US = [
  "בית הספר הגדול בישראל",
  "מדריכים מקצועיים ומוסמכים",
  "ציוד מתקדם ובטיחותי",
  "מאות טיסות ותלמידים בכל שנה",
  "פריסה ארצית – צפון | מרכז | דרום",
  "ניסיון בטיסות מותאמות לאנשים עם מגבלויות",
] as const;

export const ACCESSIBILITY_BULLETS = [
  "התאמה אישית לכל אדם",
  "ציוד ייעודי במידת הצורך",
  "צוות מנוסה בטיסות נגישות",
  "ליווי מלא מרגע ההגעה ועד הנחיתה",
] as const;

export const SAFETY = [
  "טיסה עם מדריך מוסמך בלבד",
  "ציוד תקני ובדוק",
  "פעילות בהתאם לתנאי מזג האוויר",
  "תדריך בטיחות לפני כל טיסה",
] as const;

export const TESTIMONIALS = [
  { quote: "חוויה מטורפת!", author: "דנה" },
  { quote: "המתנה הכי טובה שקיבלתי", author: "יוסי" },
  { quote: "צוות מקצועי ומרגיע", author: "שירה" },
] as const;

export const VIRAL_LINES = [
  "אם לא צרחת – הכסף חוזר 😄",
  "זה מתחיל בפחד קטן… ונגמר בהתמכרות",
  "יאללה באוויר!",
] as const;

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@7WindsParagliding";
export const YOUTUBE_SHORTS_URL = "https://www.youtube.com/@7WindsParagliding/shorts";

// Shorts from the channel — update as new ones are posted
export const YOUTUBE_SHORTS = [
  { id: "rDt6lUSI4RY" },
  { id: "uCzDCEMBCWs" },
  { id: "uC-8cWQPDVk" },
  { id: "66a3M3_L1ps" },
  { id: "O6ISeNT35Jg" },
  { id: "KGWFK2Yp2OE" },
] as const;

export const BUTTON_MICROCOPY = [
  "אני רוצה לטוס",
  "תפסו לי מקום",
  "יאללה באוויר",
  "בואו נמריא",
  "שלחו וואטסאפ",
] as const;
