import BookingForm from "@/components/forms/BookingForm";
import AffiliateWhatsAppLink from "@/components/AffiliateWhatsAppLink";
import { CONTACT, WHATSAPP_MESSAGES } from "@/lib/constants";

const WA_MESSAGE = WHATSAPP_MESSAGES.tandem;

export default function ContactSection({
  includeTestPackage = false,
}: {
  includeTestPackage?: boolean;
}) {
  return (
    <section id="booking" className="section bg-white">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <span className="inline-block rounded-full bg-brand-sky/10 text-brand-sky text-xs font-bold tracking-wide px-3 py-1">
            יאללה באוויר 🪂
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            בואו נמריא יחד
          </h2>
          <p className="mt-3 text-brand-dark leading-relaxed">
            בחרו מסלול ומספר טיסות, מלאו פרטים והמשיכו לתשלום מאובטח. מ-3 טיסות —
            הזמנה קבוצתית עם צילום חינם והנחות, או בוואטסאפ ובטלפון.
          </p>

          <div className="mt-6 space-y-3">
            <AffiliateWhatsAppLink
              message={WA_MESSAGE}
              trackLabel="contact"
              className="flex items-center justify-between rounded-2xl bg-[#25D366] text-white px-5 py-4 shadow-md hover:brightness-110 transition"
            >
              <span className="flex items-center gap-3 font-bold">
                <span className="text-2xl">💬</span>
                שלחו הודעה בוואטסאפ
              </span>
              <span>→</span>
            </AffiliateWhatsAppLink>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="flex items-center justify-between rounded-2xl bg-brand-soft ring-1 ring-black/5 text-brand-black px-5 py-4 hover:bg-white hover:shadow-md transition"
            >
              <span className="flex items-center gap-3 font-bold">
                <span className="text-2xl">📞</span>
                {CONTACT.phoneDisplay}
              </span>
              <span>→</span>
            </a>
          </div>
        </div>

        <BookingForm includeTestPackage={includeTestPackage} />
      </div>
    </section>
  );
}
