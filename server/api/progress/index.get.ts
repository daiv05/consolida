import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return useDb()
    .select({ taskKey: schema.completions.taskKey, completedAt: schema.completions.completedAt })
    .from(schema.completions)
    .where(eq(schema.completions.userId, user.id))
    .all()
})
