'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateCard } from '@/actions/kanban';
import { type cards, type teamMembers, type labels } from '@/db/schema';
import { toast } from 'sonner';
import { Calendar, User, Flag, Tag } from 'lucide-react';
import { getLabelColor } from '@/lib/label-colors';

type CardData = typeof cards.$inferSelect;
type TeamMember = typeof teamMembers.$inferSelect;
type LabelData = typeof labels.$inferSelect;

const PRIORITIES = [
    { value: 'low', label: '낮음', color: 'text-blue-500' },
    { value: 'medium', label: '보통', color: 'text-yellow-500' },
    { value: 'high', label: '높음', color: 'text-orange-500' },
    { value: 'urgent', label: '긴급', color: 'text-red-500' },
];

interface CardDetailModalProps {
    card: CardData;
    members: TeamMember[];
    allLabels: LabelData[];
    open: boolean;
    onClose: () => void;
    onUpdated: (updated: CardData) => void;
}

export function CardDetailModal({ card, members, allLabels, open, onClose, onUpdated }: CardDetailModalProps) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description ?? '');
    const [assignee, setAssignee] = useState(card.assignee ?? '');
    const [dueDate, setDueDate] = useState(
        card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
    );
    const [priority, setPriority] = useState(card.priority ?? '');
    const [selectedLabels, setSelectedLabels] = useState<string[]>(() => {
        try { return JSON.parse(card.labels ?? '[]'); } catch { return []; }
    });
    const [saving, setSaving] = useState(false);

    const toggleLabel = (id: string) =>
        setSelectedLabels((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const handleSave = async () => {
        if (!title.trim()) return;
        setSaving(true);
        try {
            const dueDateTs = dueDate ? new Date(dueDate).getTime() : null;
            const labelsJson = selectedLabels.length > 0 ? JSON.stringify(selectedLabels) : null;
            await updateCard(
                card.id,
                title.trim(),
                description,
                assignee || null,
                dueDateTs,
                priority || null,
                labelsJson,
            );
            onUpdated({
                ...card,
                title: title.trim(),
                description,
                assignee: assignee || null,
                dueDate: dueDateTs,
                priority: priority || null,
                labels: labelsJson,
            });
            toast.success('카드가 업데이트되었습니다.');
            onClose();
        } catch {
            toast.error('저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>카드 편집</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">제목</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="카드 제목"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">설명</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="설명을 입력하세요..."
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        />
                    </div>

                    {/* Assignee */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" /> 담당자
                        </label>
                        <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="">담당자 없음</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> 마감일
                        </label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    {/* Priority */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Flag className="h-3 w-3" /> 우선순위
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPriority('')}
                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${priority === '' ? 'bg-secondary border-secondary-foreground/20 font-medium' : 'border-border text-muted-foreground hover:border-foreground/40'}`}
                            >
                                없음
                            </button>
                            {PRIORITIES.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value)}
                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${priority === p.value ? 'bg-secondary border-secondary-foreground/20 font-medium ' + p.color : 'border-border text-muted-foreground hover:border-foreground/40'}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Labels */}
                    {allLabels.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Tag className="h-3 w-3" /> 레이블
                            </label>
                            <div className="flex gap-1.5 flex-wrap">
                                {allLabels.map((l) => {
                                    const c = getLabelColor(l.color);
                                    const active = selectedLabels.includes(l.id);
                                    return (
                                        <button
                                            key={l.id}
                                            type="button"
                                            onClick={() => toggleLabel(l.id)}
                                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
                                                active
                                                    ? `${c.bg} ${c.text} ${c.dark} border-transparent font-medium`
                                                    : 'border-border text-muted-foreground hover:border-foreground/40'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                            {l.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>취소</Button>
                    <Button onClick={handleSave} disabled={saving || !title.trim()}>
                        {saving ? '저장 중...' : '저장'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
