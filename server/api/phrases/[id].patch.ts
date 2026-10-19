import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = readValidParam(event, 'id', z.coerce.number().int().positive())
  const body = await readValidBody(event, phraseSchema.partial())

  const updated = useDb().update(schema.phrases).set(body)
    .where(and(eq(schema.phrases.id, id), eq(schema.phrases.userId, user.id)))
    .returning(phraseColumns)
    .get()
  if (!updated) throw createError({ statusCode: 404, message: 'No se encontró la frase.' })
  return updated
})
