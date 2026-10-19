import { asc, eq } from 'drizzle-orm'

/**
 * Escapes a value for Anki's tab-separated import format.
 *
 * @param {string} value Raw field value.
 * @returns {string} Single-line, HTML-escaped value.
 */
function field(value: string): string {
  return value.replace(/[\t\r\n]+/g, ' ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const rows = useDb().select().from(schema.phrases).where(eq(schema.phrases.userId, user.id)).orderBy(asc(schema.phrases.week), asc(schema.phrases.id)).all()

  const lines = [
    '#separator:tab',
    '#html:true',
    '#tags column:3',
    ...rows.map(row => [field(row.text), field([row.meaning, row.source].filter(Boolean).join(' · ')), `consolida semana-${row.week}`].join('\t')),
  ]
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="consolida-anki-${localIsoDate()}.txt"`)
  return `${lines.join('\n')}\n`
})
