"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { PenIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./task-card";

export type Task = {
  id: number;
  name: string;
  index: number;
};

type ColumnTaksProps = {
  id: number;
  name: string;
  tasks: Task[];
  onDrop: (
    task: Task,
    columnId_src: number,
    index_src: number,
    columnId_dest: number,
    index_dest: number
  ) => void;
};

export default function ColumnTask({
  id,
  name,
  tasks,
  onDrop,
}: ColumnTaksProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(
    () => ({
      accept: "TaskCard",
      drop: (item: Task & { columnId: number }) => {
        const { columnId, ...task } = item;
        if (columnId !== id) {
          onDrop(task, columnId, task.index, id, tasks.length);
        }
      },
    }),
    [id]
  );
  drop(ref);

  return (
    <Card>
      <CardContent className="h-full w-64 p-0 overflow-hidden">
        <CardHeader className="h-10 mb-2 px-5 py-3 shadow-sm rounded-sm flex flex-row justify-between items-center">
          <span className="text-md">{name}</span>
          <div className="flex flex-row justify-end items-center gap-2">
            <PenIcon size={18} className="text-primary" />
            <Trash2Icon size={18} className="text-primary" />
          </div>
        </CardHeader>
        <div
          ref={ref}
          className="rounded-md w-[95%] mx-auto max-h-[calc(100%-3.5rem)] h-full flex flex-col gap-1 overflow-y-auto scroll-bar"
        >
          {tasks.map((item, index) => (
            <TaskCard
              id={item.id}
              key={index}
              name={item.name}
              columnId={id}
              index={index}
              onDrop={onDrop}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
