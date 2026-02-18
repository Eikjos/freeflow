import { Card, CardContent, CardHeader } from '@components/ui/card';
import { TaskData } from '@repo/shared-types';
import { ChevronsDown, ChevronsUp, Equal } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/utils';
import TaskDetailSheet from './task-detail-sheet';

type TaskItemCardProps = {
  task: TaskData;
  className?: string;
};

export default function TaskItemCard({ task, className }: TaskItemCardProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={className}>
      <Card onClick={handleOpen} className={'hover:cursor-pointer'}>
        <CardContent
          className={cn('h-20 py-1 px-2 flex flex-col justify-between')}
        >
          <CardHeader className="p-1">
            <span className={`font-light text-sm`}>{task.name}</span>
          </CardHeader>
          <div className="w-full flex flex-row justify-end mb-1 items-center gap-2">
            <div className="bg-gray-200 p-1 rounded-full text-xs">
              {task.estimation}h
            </div>
            {task.priority === 'HIGH' && <ChevronsUp size={15} color="red" />}
            {task.priority === 'MEDIUM' && <Equal size={15} color="green" />}
            {task.priority === 'LOW' && <ChevronsDown size={15} color="blue" />}
          </div>
        </CardContent>
      </Card>
      <TaskDetailSheet open={open} onClose={handleClose} task={task} />
    </div>
  );
}
