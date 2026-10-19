import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const keySchema = z.string().refine(key => TASKS_BY_KEY.has(key))
const bodySchema = z.object({ done: z.boolean() })

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const taskKey = readValidParam(event, 'key', keySchema)
  const { done } = await readValidBody(event, bodySchema)
  const db = useDb()

  if (done) {
    db.insert(schema.completions).values({ userId: user.id, taskKey }).onConflictDoNothing().run()
  }
  else {
    db.delete(schema.completions).where(and(eq(schema.completions.userId, user.id), eq(schema.completions.taskKey, taskKey))).run()
  }
  return { taskKey, done }
})
