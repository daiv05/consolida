import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = readValidParam(event, 'id', z.coerce.number().int().positive())
  const result = useDb().delete(schema.phrases).where(and(eq(schema.phrases.id, id), eq(schema.phrases.userId, user.id))).run()
  if (!result.changes) throw createError({ statusCode: 404, message: 'No se encontró la frase.' })
  return { ok: true }
})
