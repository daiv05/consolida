import { z } from 'zod'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  startDate: isoDateSchema,
})

export default defineEventHandler(async (event) => {
  rateLimit(event, 'register', 10, 60 * 60 * 1000)
  if (!useRuntimeConfig(event).registrationOpen) {
    throw createError({ statusCode: 403, message: 'El registro está cerrado en este momento.' })
  }

  const body = await readValidBody(event, bodySchema)
  const db = useDb()
  const existing = db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, body.email)).get()
  if (existing) {
    throw createError({ statusCode: 409, message: 'Ya existe una cuenta con ese correo. Prueba a entrar.' })
  }

  const user = db.insert(schema.users).values({
    name: body.name,
    email: body.email,
    passwordHash: await hashPassword(body.password),
    startDate: normaliseStartDate(body.startDate),
  }).returning().get()

  await startSession(event, user)
  setResponseStatus(event, 201)
  return publicUser(user)
})
