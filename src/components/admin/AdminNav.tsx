export type AdminTab = "dashboard" | "leads" | "affiliates" | "notifications";

const TABS: { id: AdminTab; href: string; label: string; icon: string }[] = [
  { id: "dashboard", href: "/admin", label: "סקירה", icon: "📊" },
  { id: "leads", href: "/admin/leads", label: "לידים ושוברים", icon: "📥" },
  { id: "affiliates", href: "/admin/affiliates", label: "שותפים", icon: "🤝" },
  { id: "notifications", href: "/admin/notifications", label: "התראות", icon: "📧" },
];

export default function AdminNav({ active }: { active: AdminTab }) {
  return (
    <nav className="inline-flex items-center gap-1 rounded-full bg-brand-soft p-1 ring-1 ring-black/5">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition ${
              isActive
                ? "bg-white text-brand-black shadow-sm ring-1 ring-black/5"
                : "text-brand-dark hover:text-brand-black hover:bg-white/60"
            }`}
          >
            <span aria-hidden>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
