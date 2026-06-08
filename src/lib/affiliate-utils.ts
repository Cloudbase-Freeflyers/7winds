export function slugifyCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0590-\u05FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function affiliateUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://7windsparagliding.com";
  return `${base.replace(/\/$/, "")}/a/${code}`;
}
