export const FAVORITES_KEY = "cfm:v1:favorites";
export const RECENTS_KEY = "cfm:v1:recent-recipes";
export const LIKES_KEY = "cfm:v1:likes";

export function readStringList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
  } catch { return []; }
}

export function writeStringList(key: string, values: string[]) {
  localStorage.setItem(key, JSON.stringify(values));
  window.dispatchEvent(new CustomEvent("cfm:storage", { detail: { key } }));
}
