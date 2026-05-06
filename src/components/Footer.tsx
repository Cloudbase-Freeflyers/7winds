import Image from "next/image";
import { CONTACT, whatsappLink } from "@/lib/constants";

export default function Footer() {
  const wa = whatsappLink("היי 7Winds!");

  return (
    <footer className="bg-brand-black text-white/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
        <div>
          <Image
            src="/logo.png"
            alt="7Winds Paragliding Club"
            width={150}
            height={52}
            className="h-12 w-auto bg-white rounded-xl p-2"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            7Winds — בית הספר הגדול בישראל למצנחי רחיפה. טיסות חוויה, קורסים,
            ושוברי מתנה.
          </p>
        </div>

        <div>
          <h3 className="font-display font-bold text-white">ניווט מהיר</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-white" href="#pricing">מחירים</a></li>
            <li><a className="hover:text-white" href="#experience">החוויה</a></li>
            <li><a className="hover:text-white" href="#voucher">שוברי מתנה</a></li>
            <li><a className="hover:text-white" href="#accessibility">נגישות</a></li>
            <li><a className="hover:text-white" href="#contact">צרו קשר</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-white">צרו קשר</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:text-white" href={`tel:${CONTACT.phoneTel}`}>
                📞 {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                className="hover:text-white"
                href={wa}
                target="_blank"
                rel="noopener"
              >
                💬 וואטסאפ
              </a>
            </li>
            <li>אזורי פעילות: ארסוף · נתניה · רמת הגולן · גלבוע</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} 7Winds Paragliding Club. כל הזכויות שמורות.</p>
          <p>טיסות בכפוף לתנאי מזג האוויר ובאישור מדריך מוסמך.</p>
        </div>
      </div>
    </footer>
  );
}
