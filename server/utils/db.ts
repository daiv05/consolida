import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'

export { schema }

let instance: BetterSQLite3Database<typeof schema> | undefined

/**
 * Returns the shared Drizzle client, opening the SQLite file on first use.
 *
 * @returns {BetterSQLite3Database<typeof schema>} Database client.
 */
export function useDb(): BetterSQLite3Database<typeof schema> {
  if (instance) return instance
  const file = resolve(useRuntimeConfig().dbPath)
  mkdirSync(dirname(file), { recursive: true })
  const sqlite = new Database(file)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  sqlite.pragma('busy_timeout = 5000')
  instance = drizzle(sqlite, { schema })
  return instance
}
