import { z } from 'zod'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
  name: nameSchema.optional(),
  startDate: isoDateSchema.optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readValidBody(event, bodySchema)

  const updated = useDb().update(schema.users).set({
    name: body.name ?? user.name,
    startDate: body.startDate ? normaliseStartDate(body.startDate) : user.startDate,
  }).where(eq(schema.users.id, user.id)).returning().get()!

  await startSession(event, updated)
  return publicUser(updated)
})
