import type { H3Event } from 'h3'
import { z } from 'zod'

export const emailSchema = z.string().trim().toLowerCase().max(254, { error: 'El correo es demasiado largo.' }).pipe(z.email({ error: 'Escribe un correo válido.' }))
export const passwordSchema = z.string().min(8, { error: 'La contraseña debe tener al menos 8 caracteres.' }).max(200, { error: 'La contraseña es demasiado larga.' })
export const nameSchema = z.string().trim().min(1, { error: 'Escribe tu nombre.' }).max(80, { error: 'El nombre es demasiado largo.' })
export const isoDateSchema = z.string().refine(isIsoDate, { error: 'Elige una fecha válida.' })
export const weekSchema = z.coerce.number().int().min(1).max(PLAN_LENGTH_WEEKS)

/**
 * Reads and validates a JSON body, turning validation errors into a 400 with the first message.
 *
 * @param {H3Event} event Incoming request.
 * @param {z.ZodType<T>} schema Zod schema for the body.
 * @returns {Promise<T>} Parsed body.
 * @throws {H3Error} 400 when the body does not match the schema.
 */
export async function readValidBody<T>(event: H3Event, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown
  try {
    raw = (await readBody(event)) ?? {}
  }
  catch {
    throw createError({ statusCode: 400, message: 'El cuerpo de la petición no es JSON válido.' })
  }
  const result = schema.safeParse(raw)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.issues[0]?.message ?? 'Datos no válidos.' })
  }
  return result.data
}

/**
 * Validates a route parameter.
 *
 * @param {H3Event} event Incoming request.
 * @param {string} name Parameter name.
 * @param {z.ZodType<T>} schema Zod schema for the value.
 * @returns {T} Parsed value.
 * @throws {H3Error} 404 when the parameter is not valid.
 */
export function readValidParam<T>(event: H3Event, name: string, schema: z.ZodType<T>): T {
  const result = schema.safeParse(getRouterParam(event, name, { decode: true }))
  if (!result.success) throw createError({ statusCode: 404, message: 'No encontrado.' })
  return result.data
}
