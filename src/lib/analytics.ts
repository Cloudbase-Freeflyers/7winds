// Lightweight wrappers around GA4 + Meta Pixel that no-op when env IDs are unset.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

function pixelEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

export const track = {
  lead(source: string) {
    gaEvent("generate_lead", { source });
    pixelEvent("Lead", { source });
  },
  voucher(pkg: string) {
    gaEvent("purchase_intent", { item: pkg });
    pixelEvent("InitiateCheckout", { content_name: pkg });
  },
  whatsappClick(label: string) {
    gaEvent("whatsapp_click", { label });
    pixelEvent("Contact", { method: "whatsapp", label });
  },
  phoneClick(label: string) {
    gaEvent("phone_click", { label });
    pixelEvent("Contact", { method: "phone", label });
  },
};
