import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { TaskList } from '@/modules/tasks/components/task-list';

export default function TareasPage() {
  return (
    <AppShell title="Tareas">
      <TaskList />
    </AppShell>
  );
}
