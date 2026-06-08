"use client";

import { useState } from "react";
import type { MarketingPageLink } from "@/lib/admin-dashboard";

function fullUrl(siteUrl: string, path: string) {
  const base = siteUrl.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path}`;
}

export default function MarketingPageLinks({
  pages,
  siteUrl,
}: {
  pages: MarketingPageLink[];
  siteUrl: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mainPages = pages.filter((p) => p.type !== "affiliate");
  const affiliatePages = pages.filter((p) => p.type === "affiliate");

  async function copyLink(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-5 max-h-[420px] overflow-y-auto pe-1">
      <PageGroup
        title="דף ראשי וסקשנים"
        pages={mainPages}
        siteUrl={siteUrl}
        copiedId={copiedId}
        onCopy={copyLink}
      />
      <PageGroup
        title={`דפי שותפים (${affiliatePages.length})`}
        pages={affiliatePages}
        siteUrl={siteUrl}
        copiedId={copiedId}
        onCopy={copyLink}
        emptyText="אין דפי שותפים — צרו שותף בניהול שותפים"
      />
    </div>
  );
}

function PageGroup({
  title,
  pages,
  siteUrl,
  copiedId,
  onCopy,
  emptyText,
}: {
  title: string;
  pages: MarketingPageLink[];
  siteUrl: string;
  copiedId: string | null;
  onCopy: (id: string, url: string) => void;
  emptyText?: string;
}) {
  if (pages.length === 0 && emptyText) {
    return (
      <div>
        <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
        <p className="mt-2 text-sm text-brand-dark/80">{emptyText}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
      <ul className="mt-2 space-y-2">
        {pages.map((page) => {
          const url = fullUrl(siteUrl, page.path);
          return (
            <li
              key={page.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-soft px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate">{page.label}</p>
                <p className="text-xs text-brand-dark font-mono truncate" dir="ltr">
                  {page.path}
                </p>
                {page.description && (
                  <p className="text-xs text-brand-dark/70 mt-0.5">{page.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {page.status === "inactive" && (
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                    מושבת
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onCopy(page.id, url)}
                  className="btn-secondary btn-sm text-xs"
                >
                  {copiedId === page.id ? "הועתק!" : "העתק"}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary btn-sm text-xs"
                >
                  פתח ↗
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
