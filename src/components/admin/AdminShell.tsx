import AdminNav, { type AdminTab } from "./AdminNav";

export default function AdminShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  active: AdminTab;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <a href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-black text-white font-display text-lg font-extrabold">
              7
            </span>
            <span className="font-display text-lg font-extrabold leading-none">
              7Winds{" "}
              <span className="text-sm font-bold text-brand-dark/60">ניהול</span>
            </span>
          </a>
          <AdminNav active={active} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-brand-dark">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
