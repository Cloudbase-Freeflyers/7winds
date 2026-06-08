type Tab = "dashboard" | "leads" | "affiliates";

export default function AdminNav({ active }: { active: Tab }) {
  return (
    <nav className="flex flex-wrap gap-2">
      <a
        href="/admin"
        className={
          active === "dashboard" ? "btn-primary btn-md" : "btn-secondary btn-md"
        }
      >
        לוח בקרה
      </a>
      <a
        href="/admin/leads"
        className={active === "leads" ? "btn-primary btn-md" : "btn-secondary btn-md"}
      >
        לידים ושוברים
      </a>
      <a
        href="/admin/affiliates"
        className={
          active === "affiliates" ? "btn-primary btn-md" : "btn-secondary btn-md"
        }
      >
        שותפים
      </a>
    </nav>
  );
}
