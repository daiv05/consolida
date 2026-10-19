import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return useDb()
    .select({ week: schema.journals.week, mistakes: schema.journals.mistakes, cefr: schema.journals.cefr, notes: schema.journals.notes, updatedAt: schema.journals.updatedAt })
    .from(schema.journals)
    .where(eq(schema.journals.userId, user.id))
    .all()
})
