// Client-side rate limiting (actual enforcement done server-side via Supabase RLS)
const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxAttempts) {
    return false
  }

  entry.count++
  return true
}

export function getRemainingTime(key: string): number {
  const entry = attempts.get(key)
  if (!entry) return 0
  return Math.max(0, entry.resetAt - Date.now())
}
