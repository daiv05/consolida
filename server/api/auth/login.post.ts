import { z } from 'zod'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: 'Escribe tu contraseña.' }).max(200),
})

let dummyHash: Promise<string> | undefined

export default defineEventHandler(async (event) => {
  rateLimit(event, 'login', 10, 15 * 60 * 1000)
  const body = await readValidBody(event, bodySchema)

  const user = useDb().select().from(schema.users).where(eq(schema.users.email, body.email)).get()
  dummyHash ??= hashPassword('consolida-timing-guard')
  const valid = await verifyPassword(user?.passwordHash ?? await dummyHash, body.password)
  if (!user || !valid) {
    throw createError({ statusCode: 401, message: 'Correo o contraseña incorrectos.' })
  }

  await startSession(event, user)
  return publicUser(user)
})
