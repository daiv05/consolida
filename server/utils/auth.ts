import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'

export type UserRecord = typeof schema.users.$inferSelect

/**
 * Resolves the signed-in user from the session and the database.
 *
 * @param {H3Event} event Incoming request.
 * @returns {Promise<UserRecord>} The current user row.
 * @throws {H3Error} 401 when there is no session or the account no longer exists.
 */
export async function requireUser(event: H3Event): Promise<UserRecord> {
  const session = await requireUserSession(event)
  const user = useDb().select().from(schema.users).where(eq(schema.users.id, session.user.id)).get()
  if (!user) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, message: 'Tu sesión ha caducado. Vuelve a entrar.' })
  }
  return user
}

/**
 * Returns the public view of a user, without the password hash.
 *
 * @param {UserRecord} user User row.
 * @returns {{ id: number, name: string, email: string, startDate: string, createdAt: Date }} Safe user data.
 */
export function publicUser(user: UserRecord) {
  return { id: user.id, name: user.name, email: user.email, startDate: user.startDate, createdAt: user.createdAt }
}

/**
 * Stores the minimal user identity in the encrypted session cookie.
 *
 * @param {H3Event} event Incoming request.
 * @param {UserRecord} user User to sign in.
 * @returns {Promise<void>}
 */
export async function startSession(event: H3Event, user: UserRecord): Promise<void> {
  await replaceUserSession(event, {
    user: { id: user.id, name: user.name, email: user.email },
    loggedInAt: Date.now(),
  })
}
