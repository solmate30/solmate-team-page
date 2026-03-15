'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { type labels } from '@/db/schema';

type LabelData = typeof labels.$inferSelect;

export interface Filters {
    assignee: string;
    priority: string;
    labelId: string;
}

interface FilterBarProps {
    filters: Filters;
    members: { name: string }[];
    allLabels: LabelData[];
    onChange: (f: Filters) => void;
}

export function FilterBar({ filters, members, allLabels, onChange }: FilterBarProps) {
    const isActive = filters.assignee || filters.priority || filters.labelId;

    const set = (key: keyof Filters, value: string) =>
        onChange({ ...filters, [key]: value });

    const reset = () => onChange({ assignee: '', priority: '', labelId: '' });

    const selectCls =
        'rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring';

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <select value={filters.assignee} onChange={(e) => set('assignee', e.target.value)} className={selectCls}>
                <option value="">담당자 전체</option>
                {members.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                ))}
            </select>

            <select value={filters.priority} onChange={(e) => set('priority', e.target.value)} className={selectCls}>
                <option value="">우선순위 전체</option>
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
                <option value="urgent">긴급</option>
            </select>

            <select value={filters.labelId} onChange={(e) => set('labelId', e.target.value)} className={selectCls}>
                <option value="">레이블 전체</option>
                {allLabels.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                ))}
            </select>

            {isActive && (
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={reset}>
                    <X className="h-3 w-3" />
                    초기화
                </Button>
            )}
        </div>
    );
}
