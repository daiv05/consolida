import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const require = createRequire(new URL('../.output/server/index.mjs', import.meta.url))
const Database = require('better-sqlite3')

const source = resolve(process.env.NUXT_DB_PATH ?? '/data/consolida.db')
const target = resolve(process.argv[2] ?? `/data/backups/consolida-${new Date().toISOString().slice(0, 10)}.db`)

mkdirSync(dirname(target), { recursive: true })
const db = new Database(source, { readonly: true, fileMustExist: true })
await db.backup(target)
db.close()
console.log(target)
