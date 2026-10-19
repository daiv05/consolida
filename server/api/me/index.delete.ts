import { z } from 'zod'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({ password: z.string().min(1, { error: 'Escribe tu contraseña para confirmar.' }).max(200) })

export default defineEventHandler(async (event) => {
  rateLimit(event, 'sensitive', 10, 15 * 60 * 1000)
  const user = await requireUser(event)
  const body = await readValidBody(event, bodySchema)
  if (!(await verifyPassword(user.passwordHash, body.password))) {
    throw createError({ statusCode: 403, message: 'La contraseña no es correcta.' })
  }

  useDb().delete(schema.users).where(eq(schema.users.id, user.id)).run()
  await clearUserSession(event)
  return { ok: true }
})
