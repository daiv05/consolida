import { z } from 'zod'

const bodySchema = z.object({
  mistakes: z.array(z.string().trim().max(200, { error: 'Cada error puede tener como máximo 200 caracteres.' })).max(3),
  cefr: z.enum(CEFR_LEVELS).nullable(),
  notes: z.string().max(4000, { error: 'Las notas pueden tener como máximo 4000 caracteres.' }),
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const week = readValidParam(event, 'week', weekSchema)
  const body = await readValidBody(event, bodySchema)
  const values = { mistakes: body.mistakes, cefr: body.cefr, notes: body.notes.trim(), updatedAt: new Date() }

  return useDb()
    .insert(schema.journals)
    .values({ userId: user.id, week, ...values })
    .onConflictDoUpdate({ target: [schema.journals.userId, schema.journals.week], set: values })
    .returning({ week: schema.journals.week, mistakes: schema.journals.mistakes, cefr: schema.journals.cefr, notes: schema.journals.notes, updatedAt: schema.journals.updatedAt })
    .get()
})
