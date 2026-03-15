'use client';

import { Card as CardUI, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Draggable } from '@hello-pangea/dnd';
import { type cards, type teamMembers } from '@/db/schema';
import { Trash2, Calendar, User, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardDetailModal } from './CardDetailModal';
import { useState } from 'react';
import { type labels } from '@/db/schema';
import { getLabelColor } from '@/lib/label-colors';

type LabelData = typeof labels.$inferSelect;

type CardData = typeof cards.$inferSelect;
type TeamMember = typeof teamMembers.$inferSelect;

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
    low: { label: '낮음', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    medium: { label: '보통', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    high: { label: '높음', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    urgent: { label: '긴급', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

interface CardProps {
    card: CardData;
    index: number;
    members: TeamMember[];
    allLabels: LabelData[];
    isDragDisabled?: boolean;
    onDelete: (id: string) => void;
    onUpdated: (updated: CardData) => void;
}

export function KanbanCard({ card, index, members, allLabels, isDragDisabled, onDelete, onUpdated }: CardProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const cardLabelIds: string[] = (() => { try { return JSON.parse(card.labels ?? '[]'); } catch { return []; } })();
    const cardLabels = cardLabelIds.map((id) => allLabels.find((l) => l.id === id)).filter(Boolean) as LabelData[];

    const isOverdue = card.dueDate && card.dueDate < Date.now();
    const dueDateStr = card.dueDate
        ? new Date(card.dueDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
        : null;

    const priority = card.priority ? PRIORITY_CONFIG[card.priority] : null;

    return (
        <>
            <Draggable draggableId={card.id} index={index} isDragDisabled={isDragDisabled}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-3"
                    >
                        <CardUI
                            className="cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => setModalOpen(true)}
                        >
                            <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between space-y-0">
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    {(priority || cardLabels.length > 0) && (
                                        <div className="flex flex-wrap gap-1">
                                            {priority && (
                                                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${priority.className}`}>
                                                    <Flag className="h-2.5 w-2.5" />
                                                    {priority.label}
                                                </span>
                                            )}
                                            {cardLabels.map((l) => {
                                                const c = getLabelColor(l.color);
                                                return (
                                                    <span key={l.id} className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${c.bg} ${c.text} ${c.dark}`}>
                                                        {l.name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <CardTitle className="text-sm font-medium leading-snug">
                                        {card.title}
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive -mr-1 -mt-1 shrink-0"
                                    onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            {(card.description || card.assignee || dueDateStr) && (
                                <CardContent className="p-3 pt-0 space-y-1.5">
                                    {card.description && (
                                        <p className="text-xs text-muted-foreground break-words line-clamp-2">{card.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {card.assignee && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <User className="h-3 w-3" />
                                                {card.assignee}
                                            </span>
                                        )}
                                        {dueDateStr && (
                                            <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                                <Calendar className="h-3 w-3" />
                                                {dueDateStr}
                                                {isOverdue && ' (지남)'}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            )}
                        </CardUI>
                    </div>
                )}
            </Draggable>

            {modalOpen && (
                <CardDetailModal
                    card={card}
                    members={members}
                    allLabels={allLabels}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onUpdated={onUpdated}
                />
            )}
        </>
    );
}
