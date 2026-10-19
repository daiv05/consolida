import { count, eq } from 'drizzle-orm'

const MAX_PHRASES = 2000

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readValidBody(event, phraseSchema)
  const db = useDb()

  const total = db.select({ n: count() }).from(schema.phrases).where(eq(schema.phrases.userId, user.id)).get()?.n ?? 0
  if (total >= MAX_PHRASES) {
    throw createError({ statusCode: 422, message: `Has llegado al máximo de ${MAX_PHRASES} frases. Exporta y borra algunas.` })
  }

  setResponseStatus(event, 201)
  return db.insert(schema.phrases).values({ userId: user.id, ...body }).returning(phraseColumns).get()
})
