export const BRAND = {
  name: "7Winds Paragliding Club",
  hebrewName: "7Winds — מועדון מצנחי רחיפה",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://7windsparagliding.com",
} as const;

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972500000000";
const rawPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+972-50-000-0000";

export const CONTACT = {
  whatsappNumber: rawWhatsApp.replace(/[^\d]/g, ""),
  phoneDisplay: rawPhone,
  phoneTel: rawPhone.replace(/[^\d+]/g, ""),
} as const;

export const youtubeVideoId =
  process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "nKW4Dyv_uJ4";

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
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
