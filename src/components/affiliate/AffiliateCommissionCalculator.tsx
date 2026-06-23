"use client";

import { useMemo, useState } from "react";
import {
  CALCULATOR_PACKAGE_LABELS,
  calculateAffiliateCommissionEstimate,
  formatIls,
  type CommissionCalculatorPackage,
  type CommissionOrderLine,
} from "@/lib/affiliate-commission";
import { MAX_FLIGHT_COUNT } from "@/lib/booking-pricing";

let nextLineId = 1;

function newLine(
  pkg: CommissionCalculatorPackage = "10min",
  flightCount = 1
): CommissionOrderLine & { id: string } {
  return { id: String(nextLineId++), package: pkg, flightCount };
}

export default function AffiliateCommissionCalculator() {
  const [lines, setLines] = useState([newLine()]);
  const [additionalRevenue, setAdditionalRevenue] = useState(0);

  const estimate = useMemo(
    () =>
      calculateAffiliateCommissionEstimate(
        lines.map(({ package: pkg, flightCount }) => ({ package: pkg, flightCount })),
        additionalRevenue
      ),
    [lines, additionalRevenue]
  );

  function updateLine(
    id: string,
    patch: Partial<Pick<CommissionOrderLine, "package" | "flightCount">>
  ) {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line))
    );
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(id: string) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  }

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-black/5">
        <p className="text-sm text-brand-dark mb-5">
          הוסיפו הזמנות — המחשבון מחיל אוטומטית הנחות קבוצתיות (מ-3 טיסות: צילום
          חינם + אחוזים לפי כמות) ומחשב עמלה לפי מחזור חודשי.
        </p>

        <div className="space-y-4">
          {lines.map((line) => (
            <OrderLineRow
              key={line.id}
              line={line}
              canRemove={lines.length > 1}
              onUpdate={(patch) => updateLine(line.id, patch)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addLine}
          className="mt-4 text-sm font-bold text-brand-sky hover:text-brand-sky/80 transition"
        >
          + הוספת הזמנה
        </button>

        <div className="mt-6 pt-6 border-t border-black/5">
          <label className="block text-sm font-bold text-brand-black mb-1.5">
            מכירות נוספות בחודש (אופציונלי)
          </label>
          <p className="text-xs text-brand-dark/70 mb-2">
            הזמנות אחרות שכבר הפנית באותו חודש — משפיעות על שיעור העמלה
          </p>
          <input
            type="number"
            min={0}
            step={1}
            value={additionalRevenue || ""}
            onChange={(e) =>
              setAdditionalRevenue(Math.max(0, parseInt(e.target.value, 10) || 0))
            }
            placeholder="0"
            className="w-full max-w-xs rounded-xl border border-black/10 bg-brand-soft px-4 py-3 text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20 transition"
          />
        </div>
      </div>

      <div className="bg-brand-soft/60 p-6 sm:p-8 space-y-6">
        {estimate.lines.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-dark/60">
              פירוט הזמנות
            </p>
            {estimate.lines.map((line, i) => (
              <div
                key={`${line.package}-${line.flightCount}-${i}`}
                className="rounded-xl bg-white ring-1 ring-black/5 p-4 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-2 font-bold text-brand-black">
                  <span>
                    {line.flightCount}× {line.label}
                  </span>
                  <span className="text-brand-green">{formatIls(line.paidTotal)}</span>
                </div>
                {line.savings > 0 && (
                  <div className="mt-2 space-y-0.5 text-xs text-brand-dark">
                    <p>
                      מחיר מחירון:{" "}
                      <span className="line-through">{formatIls(line.listTotal)}</span>
                    </p>
                    {line.videoDiscount > 0 && (
                      <p className="text-green-700">
                        צילום חינם: −{formatIls(line.videoDiscount)}
                      </p>
                    )}
                    {line.percentDiscount > 0 && (
                      <p className="text-green-700">
                        הנחה {Math.round(line.percentRate * 100)}%: −
                        {formatIls(line.percentDiscount)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <dl className="space-y-2 text-sm">
          <Row label="סה״כ מחירון (ללא הנחות)" value={formatIls(estimate.listRevenue)} />
          {estimate.totalSavings > 0 && (
            <Row
              label="חיסכון מהנחות קבוצתיות"
              value={`−${formatIls(estimate.totalSavings)}`}
              accent="green"
            />
          )}
          <Row
            label="סה״כ מההזמנות (שולם בפועל)"
            value={formatIls(estimate.ordersRevenue)}
            bold
          />
          {estimate.additionalRevenue > 0 && (
            <Row
              label="מכירות נוספות בחודש"
              value={formatIls(estimate.additionalRevenue)}
            />
          )}
          <Row
            label="מחזור חודשי (בסיס לעמלה)"
            value={formatIls(estimate.monthlyRevenue)}
            bold
          />
          <Row label="שיעור עמלה" value={`${estimate.rate}%`} accent="sky" />
        </dl>

        <div className="rounded-xl bg-sky-gradient p-[2px]">
          <div className="rounded-[10px] bg-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-display font-extrabold text-lg">
              עמלה משוערת לחודש
            </span>
            <span className="font-display text-3xl font-extrabold text-brand-green">
              {formatIls(estimate.commission)}
            </span>
          </div>
        </div>

        <p className="text-xs text-brand-dark/60">
          הערכה בלבד — העמלה בפועל מחושבת על הזמנות ששולמו ואושרו. שיעור העמלה
          נקבע לפי סך המכירות בחודש.
        </p>
      </div>
    </div>
  );
}

function OrderLineRow({
  line,
  canRemove,
  onUpdate,
  onRemove,
}: {
  line: CommissionOrderLine & { id: string };
  canRemove: boolean;
  onUpdate: (patch: Partial<CommissionOrderLine>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl bg-brand-soft/80 p-4 ring-1 ring-black/5">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-bold text-brand-dark mb-1.5">מסלול</label>
        <select
          value={line.package}
          onChange={(e) =>
            onUpdate({ package: e.target.value as CommissionCalculatorPackage })
          }
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-brand-black focus:border-brand-sky focus:outline-none focus:ring-4 focus:ring-brand-sky/20"
        >
          {(Object.keys(CALCULATOR_PACKAGE_LABELS) as CommissionCalculatorPackage[]).map(
            (pkg) => (
              <option key={pkg} value={pkg}>
                {CALCULATOR_PACKAGE_LABELS[pkg]}
              </option>
            )
          )}
        </select>
      </div>

      <div className="w-36">
        <label className="block text-xs font-bold text-brand-dark mb-1.5">טיסות</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="הפחת"
            disabled={line.flightCount <= 1}
            onClick={() => onUpdate({ flightCount: Math.max(1, line.flightCount - 1) })}
            className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white font-bold disabled:opacity-40"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={MAX_FLIGHT_COUNT}
            value={line.flightCount}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) {
                onUpdate({
                  flightCount: Math.min(MAX_FLIGHT_COUNT, Math.max(1, n)),
                });
              }
            }}
            className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-center text-sm"
          />
          <button
            type="button"
            aria-label="הוסף"
            disabled={line.flightCount >= MAX_FLIGHT_COUNT}
            onClick={() =>
              onUpdate({
                flightCount: Math.min(MAX_FLIGHT_COUNT, line.flightCount + 1),
              })
            }
            className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white font-bold disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="הסר הזמנה"
          className="h-10 px-3 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition"
        >
          הסר
        </button>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: "green" | "sky";
}) {
  const valueClass =
    accent === "green"
      ? "text-brand-green font-bold"
      : accent === "sky"
        ? "text-brand-sky font-bold"
        : bold
          ? "font-bold text-brand-black"
          : "";

  return (
    <div className={`flex justify-between gap-4 ${bold ? "text-base" : ""}`}>
      <dt className="text-brand-dark">{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}
