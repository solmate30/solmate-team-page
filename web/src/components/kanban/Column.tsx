'use client';

import { Droppable } from '@hello-pangea/dnd';
import { type columns, type cards, type teamMembers, type labels } from '@/db/schema';
import { KanbanCard } from './Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { updateColumn } from '@/actions/kanban';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

type ColumnData = typeof columns.$inferSelect;
type CardData = typeof cards.$inferSelect;
type TeamMember = typeof teamMembers.$inferSelect;
type LabelData = typeof labels.$inferSelect;

interface ColumnProps {
    column: ColumnData;
    cards: CardData[];
    members: TeamMember[];
    allLabels: LabelData[];
    isDragDisabled?: boolean;
    onAddCard: (colId: string, title: string) => void;
    onDeleteColumn: (id: string) => void;
    onDeleteCard: (id: string) => void;
    onCardUpdated: (updated: CardData) => void;
}

export function KanbanColumn({ column, cards, members, allLabels, isDragDisabled, onAddCard, onDeleteColumn, onDeleteCard, onCardUpdated }: ColumnProps) {
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(column.title);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingTitle) {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }
    }, [isEditingTitle]);

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return;
        onAddCard(column.id, newCardTitle);
        setNewCardTitle('');
        setIsAddingMode(false);
    };

    const handleTitleSave = async () => {
        const trimmed = editTitle.trim();
        setIsEditingTitle(false);
        if (!trimmed || trimmed === column.title) {
            setEditTitle(column.title);
            return;
        }
        try {
            await updateColumn(column.id, trimmed);
            toast.success('컬럼 이름이 변경되었습니다.');
        } catch {
            setEditTitle(column.title);
            toast.error('컬럼 이름 변경에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="flex flex-col w-72 shrink-0 h-full max-h-full">
                <div className="bg-secondary/50 rounded-xl flex flex-col h-full overflow-hidden border">
                    {/* Column Header */}
                    <div className="p-3 pr-2 flex items-center justify-between shadow-sm z-10 bg-secondary/80 backdrop-blur-sm">
                        {isEditingTitle ? (
                            <Input
                                ref={titleInputRef}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleTitleSave();
                                    if (e.key === 'Escape') {
                                        setEditTitle(column.title);
                                        setIsEditingTitle(false);
                                    }
                                }}
                                className="h-7 text-sm font-semibold px-1 flex-1 mr-1"
                            />
                        ) : (
                            <h3
                                className="font-semibold text-sm pl-1 cursor-pointer hover:text-primary flex-1 select-none"
                                onDoubleClick={() => setIsEditingTitle(true)}
                                title="더블클릭하여 편집"
                            >
                                {column.title}
                                <span className="text-muted-foreground ml-1 font-normal text-xs">{cards.length}</span>
                            </h3>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Droppable Area */}
                    <Droppable droppableId={column.id} type="card">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                            >
                                {cards.map((card, index) => (
                                    <KanbanCard
                                        key={card.id}
                                        card={card}
                                        index={index}
                                        members={members}
                                        allLabels={allLabels}
                                        isDragDisabled={isDragDisabled}
                                        onDelete={onDeleteCard}
                                        onUpdated={onCardUpdated}
                                    />
                                ))}
                                {provided.placeholder}

                                {/* Add Card Footer */}
                                <div className="mt-2">
                                    {isAddingMode ? (
                                        <div className="space-y-2 mt-2 bg-background p-2 rounded-lg border shadow-sm">
                                            <Input
                                                autoFocus
                                                placeholder="카드 제목..."
                                                value={newCardTitle}
                                                onChange={(e) => setNewCardTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddCard();
                                                    if (e.key === 'Escape') setIsAddingMode(false);
                                                }}
                                                className="text-sm h-8"
                                            />
                                            <div className="flex items-center gap-1 justify-end">
                                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAddingMode(false)}>취소</Button>
                                                <Button size="sm" className="h-7 text-xs" onClick={handleAddCard}>추가</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-muted-foreground hover:bg-secondary/80 text-sm h-9"
                                            onClick={() => setIsAddingMode(true)}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            카드 추가
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>컬럼 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">&quot;{column.title}&quot;</span> 컬럼과 포함된 모든 카드가 삭제됩니다. 계속하시겠습니까?
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>취소</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                onDeleteColumn(column.id);
                            }}
                        >
                            삭제
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
