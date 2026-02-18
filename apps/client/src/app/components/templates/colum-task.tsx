'use client';

import { Card, CardContent, CardHeader } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { ColumnsData, TaskData } from '@repo/shared-types';
import { updateColumn } from 'actions/column';
import { Plus, Trash2Icon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import TaskCard from './task-card';
import TaksCreateSheet from './task-create-sheet';

type ColumnTaksProps = {
  id: number;
  name: string;
  index: number;
  tasks: TaskData[];
  onDropTask: (
    task: TaskData,
    columnId_dest: number,
    isCreation?: boolean,
  ) => void;
  onDropColumn: (col: ColumnsData, index_dest: number) => void;
};

export default function ColumnTask({
  id,
  name,
  index,
  tasks,
  onDropTask,
  onDropColumn,
}: ColumnTaksProps) {
  const [open, setOpen] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const ref = useRef<HTMLDivElement>(null);
  const columRef = useRef<HTMLDivElement>(null);
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'Column',
      item: { id, name, index, tasks },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 50 : 100,
      }),
    }),
    [id, name, index, tasks],
  );
  const [{ isOver }, dropRef] = useDrop<ColumnsData, void, { isOver: boolean }>(
    {
      accept: 'Column',
      drop(item: ColumnsData) {
        if (item.index !== index) {
          onDropColumn(item, index);
        }
      },
      collect(monitor) {
        const item = monitor.getItem<ColumnsData>();
        return {
          isOver: monitor.isOver() && item.id !== id,
        };
      },
    },
  );
  const [, drop] = useDrop(
    () => ({
      accept: 'TaskCard',
      drop: (item: TaskData, monitor) => {
        const isOver = monitor.isOver();
        if (isOver) {
          onDropTask(item, id);
        }
      },
    }),
    [id],
  );
  drop(ref);
  dragRef(dropRef(columRef));

  const openTaskSheet = () => {
    setOpen(true);
  };

  const addTask = (task: TaskData) => {
    onDropTask(task, id, true);
  };

  const updateTask = (task: TaskData) => {
    console.log('update', task);
    onDropTask(task, id, true);
  };

  const onDeleteTask = (task: TaskData) => {
    onDropTask(task, 0, true);
  };

  const handleUpdateColumn = (event: React.FocusEvent<HTMLInputElement>) => {
    updateColumn(id, { name: event.currentTarget.value })
      .then((res) => {
        if (res) {
          setCurrentName(res.name);
        }
      })
      .catch((e: Error) => {
        toast.error(e.message);
        setCurrentName(name);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.currentTarget.value);
  };

  return (
    <>
      {isOver && <div className="mx-1 bg-gray-100 w-2 rounded-lg"></div>}
      <Card ref={columRef}>
        <CardContent
          className={cn(
            'h-full w-64 p-0 overflow-hidden',
            `opacity-${opacity}`,
          )}
        >
          <CardHeader className="h-10 mb-2 px-5 pl-0 py-3 shadow-sm rounded-sm flex flex-row justify-between items-center">
            <Input
              type="text"
              className="text-md"
              value={currentName}
              onChange={handleChange}
              variant="ghost"
              onBlur={handleUpdateColumn}
            />
            <div className="flex flex-row justify-end items-center gap-2">
              <Trash2Icon size={18} className="text-primary" />
              <Plus
                size={18}
                className="text-primary"
                onClick={openTaskSheet}
              />
            </div>
          </CardHeader>
          <div
            ref={ref}
            className="rounded-md w-[95%] mx-auto max-h-[calc(100%-3.5rem)] h-full flex flex-col gap-2 overflow-y-auto scroll-bar"
          >
            {tasks
              .sort((a, b) => a.index - b.index)
              .map((item) => (
                <TaskCard
                  task={item}
                  key={item.id}
                  // onDrop={onDropTask}
                  onEdit={updateTask}
                  onDelete={onDeleteTask}
                />
              ))}
          </div>
        </CardContent>
      </Card>
      <TaksCreateSheet
        open={open}
        onClose={() => setOpen(false)}
        columnId={id}
        onAddTask={addTask}
      />
    </>
  );
}
