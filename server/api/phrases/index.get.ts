import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return useDb()
    .select(phraseColumns)
    .from(schema.phrases)
    .where(eq(schema.phrases.userId, user.id))
    .orderBy(desc(schema.phrases.createdAt), desc(schema.phrases.id))
    .all()
})
