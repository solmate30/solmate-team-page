import { getBoardData, getTeamMembers, getLabels, ensureArchiveColumn } from '@/actions/kanban';
import { KanbanBoard } from '@/components/kanban/Board';

export const dynamic = 'force-dynamic';

export default async function KanbanPage() {
  await ensureArchiveColumn();
  
  const [{ columns, cards }, members, allLabels] = await Promise.all([
    getBoardData(),
    getTeamMembers(),
    getLabels(),
  ]);

  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <KanbanBoard initialColumns={columns} initialCards={cards} initialMembers={members} initialLabels={allLabels} />
    </main>
  );
}
