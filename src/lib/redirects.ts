const DEFAULT_REDIRECT = "/dashboard";

export function safeRedirectPath(value: string | null, fallback = DEFAULT_REDIRECT) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const parsed = new URL(value, "https://ecopulse.local");
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
