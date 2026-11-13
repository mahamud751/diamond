export function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function safeNext(value: string | undefined | null) {
  if (!value) return "/account";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/account";
  }
  return value;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
