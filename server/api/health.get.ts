import { sql } from 'drizzle-orm'

export default defineEventHandler(() => {
  useDb().get(sql`select 1`)
  return { status: 'ok' }
})
