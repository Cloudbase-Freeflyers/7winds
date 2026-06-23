import type { Metadata } from "next";
import Link from "next/link";
import { ACCESSIBILITY_STATEMENT, BRAND, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "הצהרת נגישות של אתר 7Winds Paragliding Club",
  alternates: { canonical: "/accessibility-statement" },
};

export default function AccessibilityStatementPage() {
  const { coordinator, lastUpdated, standard } = ACCESSIBILITY_STATEMENT;

  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <header className="bg-white border-b border-black/5">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-brand-sky font-bold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky rounded"
          >
            ← חזרה לדף הבית
          </Link>
          <span className="font-display font-bold text-brand-dark">7Winds</span>
        </div>
      </header>

      <main id="main-content" className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-black">
          הצהרת נגישות
        </h1>
        <p className="mt-3 text-brand-dark leading-relaxed">
          {BRAND.hebrewName} מחויב להנגשת האתר ולאפשר לכלל האוכלוסייה, לרבות
          אנשים עם מוגבלות, לגלוש בו בקלות ובנוחות.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-xl font-bold">כללי</h2>
          <p className="leading-relaxed text-brand-dark">
            אתר זה מופעל על ידי {BRAND.name}. אנו פועלים להנגשת האתר בהתאם
            לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
            התשע״ג-2013, ו{standard}.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-xl font-bold">תוסף הנגישות</h2>
          <p className="leading-relaxed text-brand-dark">
            באתר מותקן תוסף נגישות (כפתור ♿ בפינה השמאלית התחתונה) המאפשר:
          </p>
          <ul className="list-disc list-inside space-y-2 text-brand-dark leading-relaxed">
            <li>הגדלת והקטנת גודל הטקסט</li>
            <li>מצב ניגודיות גבוהה</li>
            <li>הדגשת קישורים</li>
            <li>מעבר לגופן קריא</li>
            <li>עצירת אנימציות</li>
            <li>מצב גווני אפור</li>
            <li>איפוס הגדרות הנגישות</li>
          </ul>
          <p className="leading-relaxed text-brand-dark">
            ההגדרות נשמרות בדפדפן ויחולו גם בביקורים הבאים.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-xl font-bold">התאמות נוספות</h2>
          <ul className="list-disc list-inside space-y-2 text-brand-dark leading-relaxed">
            <li>מבנה סמנטי וכותרות מסודרות</li>
            <li>תמיכה בניווט מקלדת</li>
            <li>טקסט חלופי (alt) לתמונות</li>
            <li>שפה וכיוון (RTL) מוגדרים בדף</li>
            <li>ניגודיות צבעים מותאמת לקריאה</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-xl font-bold">דפדפנים ומכשירים</h2>
          <p className="leading-relaxed text-brand-dark">
            האתר נבדק ומותאם לגלישה בדפדפנים Chrome, Firefox, Safari ו-Edge
            בגרסאות עדכניות, וכן במכשירים ניידים (iOS ו-Android).
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-xl font-bold">פערי נגישות ידועים</h2>
          <p className="leading-relaxed text-brand-dark">
            אנו ממשיכים לשפר את נגישות האתר. ייתכן שחלק מהתכנים המוטמעים
            (כגון סרטוני YouTube) אינם נגישים במלואם — אנו עובדים על מציאת
            פתרונות חלופיים.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-xl font-bold">יצירת קשר בנושא נגישות</h2>
          <p className="leading-relaxed text-brand-dark">
            נתקלתם בבעיית נגישות? נשמח לעזור ולטפל בפנייה בהקדם.
          </p>
          <dl className="rounded-2xl bg-white p-5 ring-1 ring-black/5 space-y-3 text-brand-dark">
            <div>
              <dt className="font-semibold">רכז/ת נגישות</dt>
              <dd>{coordinator.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">טלפון</dt>
              <dd>
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="text-brand-sky hover:underline"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </dd>
            </div>
            {coordinator.email && (
              <div>
                <dt className="font-semibold">דוא״ל</dt>
                <dd>
                  <a
                    href={`mailto:${coordinator.email}`}
                    className="text-brand-sky hover:underline"
                  >
                    {coordinator.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>

        <p className="mt-10 text-sm text-brand-dark/70">
          הצהרה זו עודכנה לאחרונה: {lastUpdated}
        </p>
      </main>
    </div>
  );
}
