import { z } from 'zod'

export const phraseSchema = z.object({
  week: weekSchema,
  text: z.string().trim().min(1, { error: 'Escribe la frase.' }).max(300, { error: 'La frase puede tener como máximo 300 caracteres.' }),
  meaning: z.string().trim().max(300, { error: 'El significado puede tener como máximo 300 caracteres.' }).default(''),
  source: z.string().trim().max(200, { error: 'La fuente puede tener como máximo 200 caracteres.' }).default(''),
})

export const phraseColumns = {
  id: schema.phrases.id,
  week: schema.phrases.week,
  text: schema.phrases.text,
  meaning: schema.phrases.meaning,
  source: schema.phrases.source,
  createdAt: schema.phrases.createdAt,
}
