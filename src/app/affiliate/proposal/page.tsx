import AffiliateCommissionProposal from "@/components/affiliate/AffiliateCommissionProposal";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "תוכנית עמלות שותפים",
  description: `מבנה עמלות והכנסות לשותפי ${BRAND.name} — טיסות טנדם במצנח רחיפה בישראל`,
  robots: { index: false, follow: false },
};

export default function AffiliateProposalPage() {
  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <AffiliateCommissionProposal />
      </div>
    </div>
  );
}
