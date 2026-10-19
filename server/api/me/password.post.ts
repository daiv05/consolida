import { z } from 'zod'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
  currentPassword: z.string().min(1, { error: 'Escribe tu contraseña actual.' }).max(200),
  newPassword: passwordSchema,
})

export default defineEventHandler(async (event) => {
  rateLimit(event, 'sensitive', 10, 15 * 60 * 1000)
  const user = await requireUser(event)
  const body = await readValidBody(event, bodySchema)
  if (!(await verifyPassword(user.passwordHash, body.currentPassword))) {
    throw createError({ statusCode: 403, message: 'La contraseña actual no es correcta.' })
  }

  useDb().update(schema.users).set({ passwordHash: await hashPassword(body.newPassword) }).where(eq(schema.users.id, user.id)).run()
  return { ok: true }
})
