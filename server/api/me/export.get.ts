import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const db = useDb()
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="consolida-${localIsoDate()}.json"`)
  return {
    exportedAt: new Date().toISOString(),
    user: publicUser(user),
    completions: db.select({ taskKey: schema.completions.taskKey, completedAt: schema.completions.completedAt }).from(schema.completions).where(eq(schema.completions.userId, user.id)).all(),
    journals: db.select({ week: schema.journals.week, mistakes: schema.journals.mistakes, cefr: schema.journals.cefr, notes: schema.journals.notes, updatedAt: schema.journals.updatedAt }).from(schema.journals).where(eq(schema.journals.userId, user.id)).all(),
    phrases: db.select({ week: schema.phrases.week, text: schema.phrases.text, meaning: schema.phrases.meaning, source: schema.phrases.source, createdAt: schema.phrases.createdAt }).from(schema.phrases).where(eq(schema.phrases.userId, user.id)).all(),
  }
})
