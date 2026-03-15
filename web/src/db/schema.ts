import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const columns = sqliteTable('columns', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    position: integer('position').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    collapsed: integer('collapsed', { mode: 'boolean' }).default(false),
});

export const cards = sqliteTable('cards', {
    id: text('id').primaryKey(),
    columnId: text('column_id')
        .notNull()
        .references(() => columns.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    position: integer('position').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    assignee: text('assignee'),
    dueDate: integer('due_date'),
    completedAt: integer('completed_at'),
    priority: text('priority'),
    labels: text('labels'),
    archived: integer('archived', { mode: 'boolean' }).default(false),
});

export const labels = sqliteTable('labels', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    color: text('color').notNull(), // e.g. "red", "blue"
});

export const teamMembers = sqliteTable('team_members', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
});
