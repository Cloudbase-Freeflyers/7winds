"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "צריך ניסיון קודם?",
    a: "בכלל לא. טיסת טנדם מיועדת לכולם — הטייס המקצועי עושה את כל העבודה. אתם רק נהנים.",
  },
  {
    q: "זה בטוח?",
    a: "כן. כל הטיסות מתבצעות עם מדריכים מוסמכים, ציוד תקני ובדוק, ורק בתנאי מזג אוויר מתאימים. הבטיחות שלכם היא מעל הכל.",
  },
  {
    q: "כמה זמן הטיסה?",
    a: "יש טיסות של 10 דקות ו-20 דקות. בנוסף קיימת טיסת אקרובטיקה עם פעלולים. תלוי איזה מסלול בוחרים.",
  },
  {
    q: "אפשר כמתנה?",
    a: "כן! אנחנו מציעים שוברי מתנה דיגיטליים שנשלחים מיד לאחר הרכישה — מוכנים לשליחה בוואטסאפ או להדפסה. תוקף שנה.",
  },
  {
    q: "מה אם יש רוח או גשם?",
    a: "הטיסות מותנות בתנאי מזג אוויר. אם יש יום לא מתאים, מתאמים איתכם יום חלופי ללא עלות.",
  },
  {
    q: "מה לובשים לטיסה?",
    a: "בגדים נוחים וסגורים, נעלי ספורט עם שרוכים. סנדלים וכפכפים — לא. בקיץ כדאי להביא שכבה קלה, באוויר קצת יותר קריר.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            שאלות נפוצות
          </h2>
          <p className="mt-3 text-brand-dark">
            כל מה שרצית לדעת לפני שעפים.
          </p>
        </div>

        <ul className="mt-8 divide-y divide-black/6">
          {FAQS.map((faq, i) => (
            <li key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-4 text-right font-semibold text-brand-black hover:text-brand-sky transition"
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <span
                  className={`text-xl text-brand-sky shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-4 text-brand-dark leading-relaxed text-sm">
                  {faq.a}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
