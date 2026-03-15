'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addTeamMember, deleteTeamMember } from '@/actions/kanban';
import { type teamMembers } from '@/db/schema';
import { toast } from 'sonner';
import { Trash2, Plus, Users } from 'lucide-react';

type TeamMember = typeof teamMembers.$inferSelect;

interface TeamSettingsModalProps {
    members: TeamMember[];
    open: boolean;
    onClose: () => void;
    onMembersChange: (members: TeamMember[]) => void;
}

export function TeamSettingsModal({ members, open, onClose, onMembersChange }: TeamSettingsModalProps) {
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setAdding(true);
        try {
            await addTeamMember(newName.trim());
            // Optimistic: we don't have the id, so we'll use a temp id
            const tempMember = { id: crypto.randomUUID(), name: newName.trim() };
            onMembersChange([...members, tempMember]);
            setNewName('');
            toast.success(`${newName.trim()} 추가됨`);
        } catch {
            toast.error('팀원 추가에 실패했습니다.');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (member: TeamMember) => {
        try {
            await deleteTeamMember(member.id);
            onMembersChange(members.filter((m) => m.id !== member.id));
            toast.success(`${member.name} 삭제됨`);
        } catch {
            toast.error('팀원 삭제에 실패했습니다.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> 팀원 관리
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Add member */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="팀원 이름"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAdd();
                            }}
                        />
                        <Button size="sm" onClick={handleAdd} disabled={adding || !newName.trim()}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Member list */}
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                        {members.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">팀원이 없습니다.</p>
                        )}
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-secondary/50">
                                <span className="text-sm">{member.name}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDelete(member)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
