'use server';

import { db } from '@/db';
import { columns, cards, teamMembers, labels } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import crypto from 'node:crypto';

function generateId() {
    return crypto.randomUUID();
}

export async function getBoardData() {
    const allColumns = await db.query.columns.findMany({
        orderBy: [asc(columns.position)],
    });

    const allCards = await db.query.cards.findMany({
        orderBy: [asc(cards.position)],
    });

    return { columns: allColumns, cards: allCards };
}

export async function getBoardDataPolling() {
    const allColumns = await db.query.columns.findMany({
        orderBy: [asc(columns.position)],
    });

    const allCards = await db.query.cards.findMany({
        orderBy: [asc(cards.position)],
    });

    return { columns: allColumns, cards: allCards };
}

export async function addColumn(title: string) {
    const existingCols = await db.query.columns.findMany();
    const position = existingCols.length;

    await db.insert(columns).values({
        id: generateId(),
        title,
        position,
        createdAt: new Date(),
    });

    revalidatePath('/kanban');
}

export async function deleteColumn(id: string) {
    await db.delete(columns).where(eq(columns.id, id));
    revalidatePath('/kanban');
}

export async function updateColumn(id: string, title: string) {
    await db.update(columns).set({ title }).where(eq(columns.id, id));
    revalidatePath('/kanban');
}

export async function addCard(
    columnId: string,
    title: string,
    description: string = '',
    assignee?: string,
    dueDate?: number,
    priority?: string,
    labelsJson?: string,
) {
    const existingCards = await db.query.cards.findMany({
        where: eq(cards.columnId, columnId),
    });
    const position = existingCards.length;

    await db.insert(cards).values({
        id: generateId(),
        columnId,
        title,
        description,
        position,
        createdAt: new Date(),
        assignee: assignee ?? null,
        dueDate: dueDate ?? null,
        priority: priority ?? null,
        labels: labelsJson ?? null,
    });

    revalidatePath('/kanban');
}

export async function updateCard(
    id: string,
    title: string,
    description: string,
    assignee?: string | null,
    dueDate?: number | null,
    priority?: string | null,
    labelsJson?: string | null,
) {
    await db.update(cards)
        .set({ title, description, assignee: assignee ?? null, dueDate: dueDate ?? null, priority: priority ?? null, labels: labelsJson ?? null })
        .where(eq(cards.id, id));
    revalidatePath('/kanban');
}

export async function deleteCard(id: string) {
    await db.delete(cards).where(eq(cards.id, id));
    revalidatePath('/kanban');
}

export async function updateCardPositions(updates: { id: string; columnId: string; position: number }[]) {
    for (const update of updates) {
        await db.update(cards)
            .set({ columnId: update.columnId, position: update.position })
            .where(eq(cards.id, update.id));
    }
    revalidatePath('/kanban');
}

export async function getTeamMembers() {
    return db.query.teamMembers.findMany();
}

export async function addTeamMember(name: string) {
    await db.insert(teamMembers).values({ id: generateId(), name });
    revalidatePath('/kanban');
}

export async function deleteTeamMember(id: string) {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    revalidatePath('/kanban');
}

export async function getLabels() {
    return db.query.labels.findMany({ orderBy: [asc(labels.name)] });
}

export async function addLabel(name: string, color: string) {
    await db.insert(labels).values({ id: generateId(), name, color });
    revalidatePath('/kanban');
}

export async function deleteLabel(id: string) {
    await db.delete(labels).where(eq(labels.id, id));
    revalidatePath('/kanban');
}
