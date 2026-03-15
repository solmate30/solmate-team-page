'use client';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { type columns, type cards, type teamMembers, type labels } from '@/db/schema';
import { KanbanColumn } from './Column';
import { TeamSettingsModal } from './TeamSettingsModal';
import { FilterBar, type Filters } from './FilterBar';
import { LabelManagerModal } from './LabelManagerModal';
import { useState, useEffect, useCallback } from 'react';
import { updateCardPositions, addCard, deleteColumn, deleteCard, addColumn, getBoardDataPolling, getLabels, updateColumnPositions } from '@/actions/kanban';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Tag, Home } from 'lucide-react';
import { toast } from 'sonner';

type ColumnData = typeof columns.$inferSelect;
type CardData = typeof cards.$inferSelect;
type TeamMember = typeof teamMembers.$inferSelect;
type LabelData = typeof labels.$inferSelect;

interface BoardProps {
    initialColumns: ColumnData[];
    initialCards: CardData[];
    initialMembers: TeamMember[];
    initialLabels: LabelData[];
}

export function KanbanBoard({ initialColumns, initialCards, initialMembers, initialLabels }: BoardProps) {
    const [columnsState, setColumnsState] = useState(initialColumns);
    const [cardsState, setCardsState] = useState(initialCards);
    const [members, setMembers] = useState(initialMembers);
    const [allLabels, setAllLabels] = useState(initialLabels);
    const [filters, setFilters] = useState<Filters>({ assignee: '', priority: '', labelId: '' });
    const [isAddingCol, setIsAddingCol] = useState(false);
    const [newColTitle, setNewColTitle] = useState('');
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [labelModalOpen, setLabelModalOpen] = useState(false);

    useEffect(() => {
        setColumnsState(initialColumns);
        setCardsState(initialCards);
    }, [initialColumns, initialCards]);

    const poll = useCallback(async () => {
        try {
            const data = await getBoardDataPolling();
            setColumnsState(data.columns);
            setCardsState(data.cards);
        } catch {
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(poll, 5000);
        return () => clearInterval(timer);
    }, [poll]);

    const refreshLabels = useCallback(async () => {
        try {
            const updated = await getLabels();
            setAllLabels(updated);
        } catch { }
    }, []);

    const isFiltering = !!(filters.assignee || filters.priority || filters.labelId);

    const filteredCards = isFiltering
        ? cardsState.filter((c) => {
            if (filters.assignee && c.assignee !== filters.assignee) return false;
            if (filters.priority && c.priority !== filters.priority) return false;
            if (filters.labelId) {
                try {
                    const ids: string[] = JSON.parse(c.labels ?? '[]');
                    if (!ids.includes(filters.labelId)) return false;
                } catch {
                    return false;
                }
            }
            return true;
        })
        : cardsState;

    const onDragEnd = async (result: DropResult) => {
        if (isFiltering) return;
        const { source, destination, draggableId, type } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // 컬럼 드래그
        if (type === 'column') {
            const newColumns = Array.from(columnsState);
            const [movedColumn] = newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, movedColumn);
            
            setColumnsState(newColumns);
            
            try {
                await updateColumnPositions(
                    newColumns.map((col, idx) => ({ id: col.id, position: idx }))
                );
            } catch {
                toast.error('컬럼 순서 변경에 실패했습니다.');
            }
            return;
        }

        // 카드 드래그
        const draggedCard = cardsState.find((c) => c.id === draggableId);
        if (!draggedCard) return;

        const newCards = Array.from(cardsState);

        const sourceCards = newCards.filter(c => c.columnId === source.droppableId).sort((a, b) => a.position - b.position);
        sourceCards.splice(source.index, 1);

        const destCards = source.droppableId === destination.droppableId
            ? sourceCards
            : newCards.filter(c => c.columnId === destination.droppableId).sort((a, b) => a.position - b.position);

        destCards.splice(destination.index, 0, draggedCard);

        const updates: { id: string; columnId: string; position: number }[] = [];

        sourceCards.forEach((c, idx) => {
            c.position = idx;
            updates.push({ id: c.id, columnId: source.droppableId, position: idx });
        });

        if (source.droppableId !== destination.droppableId) {
            destCards.forEach((c, idx) => {
                c.position = idx;
                c.columnId = destination.droppableId;
                updates.push({ id: c.id, columnId: destination.droppableId, position: idx });
            });
        }

        setCardsState([
            ...newCards.filter(c => c.columnId !== source.droppableId && c.columnId !== destination.droppableId),
            ...sourceCards,
            ...(source.droppableId !== destination.droppableId ? destCards : [])
        ]);

        try {
            await updateCardPositions(updates);
        } catch {
            toast.error('카드 이동에 실패했습니다.');
        }
    };

    const handleAddColumn = async () => {
        if (!newColTitle.trim()) return;
        setIsAddingCol(false);
        try {
            await addColumn(newColTitle);
            setNewColTitle('');
        } catch {
            toast.error('컬럼 추가에 실패했습니다.');
        }
    };

    const handleDeleteColumn = async (id: string) => {
        try {
            await deleteColumn(id);
        } catch {
            toast.error('컬럼 삭제에 실패했습니다.');
        }
    };

    const handleDeleteCard = async (id: string) => {
        setCardsState((prev) => prev.filter((c) => c.id !== id));
        try {
            await deleteCard(id);
        } catch {
            toast.error('카드 삭제에 실패했습니다.');
            poll();
        }
    };

    const handleAddCard = async (colId: string, title: string) => {
        try {
            await addCard(colId, title);
        } catch {
            toast.error('카드 추가에 실패했습니다.');
        }
    };

    const handleCardUpdated = (updated: CardData) => {
        setCardsState((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    };

    return (
        <div className="flex flex-col h-full bg-background p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <Home className="mr-2 h-4 w-4" />
                            메인
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Solmate Kanban Board</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setLabelModalOpen(true); }}>
                        <Tag className="mr-2 h-4 w-4" />
                        레이블 관리
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTeamModalOpen(true)}>
                        <Users className="mr-2 h-4 w-4" />
                        팀원 관리
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <FilterBar
                    filters={filters}
                    members={members}
                    allLabels={allLabels}
                    onChange={setFilters}
                />
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pt-2 pb-4">
                <div className="flex h-full items-start gap-4 pr-6 pb-2">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="all-columns" direction="horizontal" type="column">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex h-full items-start gap-4"
                                >
                                    {columnsState.map((column, index) => (
                                        <KanbanColumn
                                            key={column.id}
                                            column={column}
                                            index={index}
                                            cards={filteredCards.filter((c) => c.columnId === column.id).sort((a, b) => a.position - b.position)}
                                            members={members}
                                            allLabels={allLabels}
                                            isDragDisabled={isFiltering}
                                            onAddCard={handleAddCard}
                                            onDeleteColumn={handleDeleteColumn}
                                            onDeleteCard={handleDeleteCard}
                                            onCardUpdated={handleCardUpdated}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="w-72 shrink-0 h-full max-h-full">
                        <div className="bg-secondary/30 border border-dashed rounded-xl p-3 flex flex-col justify-center transition-colors hover:bg-secondary/50">
                            {isAddingCol ? (
                                <div className="space-y-3">
                                    <Input
                                        autoFocus
                                        placeholder="컬럼 제목..."
                                        value={newColTitle}
                                        onChange={(e) => setNewColTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddColumn();
                                            if (e.key === 'Escape') setIsAddingCol(false);
                                        }}
                                    />
                                    <div className="flex items-center gap-2 justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => setIsAddingCol(false)}>취소</Button>
                                        <Button size="sm" onClick={handleAddColumn}>저장</Button>
                                    </div>
                                </div>
                            ) : (
                                <Button variant="ghost" className="h-10 text-muted-foreground w-full justify-start text-sm" onClick={() => setIsAddingCol(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> 컬럼 추가
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TeamSettingsModal
                members={members}
                open={teamModalOpen}
                onClose={() => setTeamModalOpen(false)}
                onMembersChange={setMembers}
            />

            <LabelManagerModal
                open={labelModalOpen}
                onClose={() => { setLabelModalOpen(false); refreshLabels(); }}
                allLabels={allLabels}
                onLabelsChange={setAllLabels}
            />
        </div>
    );
}
