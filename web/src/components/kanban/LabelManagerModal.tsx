'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { addLabel, deleteLabel } from '@/actions/kanban';
import { type labels } from '@/db/schema';
import { LABEL_COLORS, getLabelColor } from '@/lib/label-colors';
import { toast } from 'sonner';

type LabelData = typeof labels.$inferSelect;

interface LabelManagerModalProps {
    open: boolean;
    onClose: () => void;
    allLabels: LabelData[];
    onLabelsChange: (labels: LabelData[]) => void;
}

export function LabelManagerModal({ open, onClose, allLabels, onLabelsChange }: LabelManagerModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('blue');
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            await addLabel(name.trim(), color);
            // optimistic update via refetch is handled by revalidatePath;
            // for instant UI, we rely on parent polling or page revalidation
            toast.success('레이블이 추가되었습니다.');
            setName('');
        } catch {
            toast.error('레이블 추가에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            onLabelsChange(allLabels.filter((l) => l.id !== id));
            await deleteLabel(id);
        } catch {
            toast.error('레이블 삭제에 실패했습니다.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>레이블 관리</DialogTitle>
                </DialogHeader>

                {/* Add label */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="레이블 이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
                            className="flex-1 h-8 text-sm"
                        />
                        <Button size="sm" onClick={handleAdd} disabled={saving || !name.trim()} className="h-8">
                            추가
                        </Button>
                    </div>

                    {/* Color swatches */}
                    <div className="flex gap-1.5 flex-wrap">
                        {LABEL_COLORS.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setColor(c.id)}
                                className={`w-6 h-6 rounded-full ${c.dot} ring-offset-1 transition-all ${color === c.id ? 'ring-2 ring-foreground' : ''}`}
                                title={c.id}
                            />
                        ))}
                    </div>
                </div>

                {/* Label list */}
                <div className="space-y-1.5 mt-2 max-h-60 overflow-y-auto">
                    {allLabels.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">레이블이 없습니다.</p>
                    )}
                    {allLabels.map((l) => {
                        const c = getLabelColor(l.color);
                        return (
                            <div key={l.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/50">
                                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text} ${c.dark}`}>
                                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                                    {l.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDelete(l.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
