"use client";

import { useRef, useState } from "react";
import VoucherCard from "@/components/VoucherCard";

type Props = {
  recipientName?: string | null;
  occasion?: string | null;
  orderId?: string | null;
};

export default function VoucherPdfDownload({
  recipientName,
  occasion,
  orderId,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  async function downloadPdf() {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a5",
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = canvas.width / canvas.height;

      let imgW = maxW;
      let imgH = imgW / ratio;
      if (imgH > maxH) {
        imgH = maxH;
        imgW = imgH * ratio;
      }

      const x = (pageW - imgW) / 2;
      const y = (pageH - imgH) / 2;
      pdf.addImage(imgData, "PNG", x, y, imgW, imgH);

      const filename = orderId
        ? `7winds-voucher-${orderId.slice(0, 8)}.pdf`
        : "7winds-gift-voucher.pdf";
      pdf.save(filename);
    } catch {
      alert("לא הצלחנו ליצור PDF. נסו שוב או הדפיסו את הדף.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="mx-auto max-w-lg rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white p-2"
      >
        <VoucherCard
          recipientName={recipientName || undefined}
          occasion={occasion || undefined}
          printable
        />
      </div>

      <button
        type="button"
        onClick={downloadPdf}
        disabled={generating}
        className="btn-secondary btn-lg w-full"
      >
        {generating ? "מכין PDF…" : "📄 הורידו PDF לשיתוף עם המקבל/ת"}
      </button>
    </div>
  );
}
