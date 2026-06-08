"use client";

import { whatsappLink } from "@/lib/constants";
import { useAffiliateCode } from "@/context/AffiliateContext";
import { track } from "@/lib/analytics";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  message: string;
  trackLabel?: string;
};

export default function AffiliateWhatsAppLink({
  message,
  trackLabel,
  onClick,
  children,
  ...rest
}: Props) {
  const affiliateCode = useAffiliateCode();
  const href = whatsappLink(message, affiliateCode);

  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={(e) => {
        if (trackLabel) track.whatsappClick(trackLabel, affiliateCode ?? undefined);
        if (affiliateCode) {
          fetch("/api/affiliates/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: affiliateCode,
              type: "whatsapp_click",
              label: trackLabel,
            }),
          }).catch(() => {});
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
