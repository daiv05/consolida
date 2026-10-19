import { sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  startDate: text('start_date').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const completions = sqliteTable('completions', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskKey: text('task_key').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, table => [primaryKey({ columns: [table.userId, table.taskKey] })])

export const journals = sqliteTable('journals', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  week: integer('week').notNull(),
  mistakes: text('mistakes', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  cefr: text('cefr'),
  notes: text('notes').notNull().default(''),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, table => [primaryKey({ columns: [table.userId, table.week] })])

export const phrases = sqliteTable('phrases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  week: integer('week').notNull(),
  text: text('text').notNull(),
  meaning: text('meaning').notNull().default(''),
  source: text('source').notNull().default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, table => [index('phrases_user_idx').on(table.userId, table.week)])
