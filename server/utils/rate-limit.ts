import type { H3Event } from 'h3'

const buckets = new Map<string, { count: number, resetAt: number }>()

/**
 * Applies a fixed-window rate limit per client IP and bucket name.
 *
 * @param {H3Event} event Incoming request.
 * @param {string} name Bucket name, such as "login".
 * @param {number} limit Maximum requests allowed per window.
 * @param {number} windowMs Window length in milliseconds.
 * @throws {H3Error} 429 when the limit is exceeded.
 */
export function rateLimit(event: H3Event, name: string, limit: number, windowMs: number): void {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const key = `${name}:${ip}`
  const now = Date.now()

  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
  }

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  bucket.count++
  if (bucket.count > limit) {
    setResponseHeader(event, 'Retry-After', Math.ceil((bucket.resetAt - now) / 1000))
    throw createError({ statusCode: 429, message: 'Demasiados intentos. Espera unos minutos y vuelve a probar.' })
  }
}
