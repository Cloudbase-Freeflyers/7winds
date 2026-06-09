import AffiliateLoginForm from "@/components/affiliate/AffiliateLoginForm";

export const metadata = {
  title: "כניסת שותפים",
  robots: { index: false, follow: false },
};

export default function AffiliateLoginPage() {
  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-md mx-auto px-5 py-16">
        <header className="text-center mb-8">
          <p className="text-brand-sky font-bold text-sm">7Winds</p>
          <h1 className="font-display text-3xl font-extrabold mt-2">
            כניסת שותפים
          </h1>
          <p className="text-brand-dark text-sm mt-2">
            צפו בביצועים, בקישור האישי ובקוד QR שלכם.
          </p>
        </header>
        <AffiliateLoginForm />
      </div>
    </div>
  );
}
