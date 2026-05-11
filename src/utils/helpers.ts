export function getBaseUrl(): string {
  return import.meta.env.VITE_SITE_URL ?? window.location.origin
}
