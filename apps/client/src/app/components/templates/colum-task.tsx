"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { PenIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import TaskCard from "./task-card";
import { cn } from "../../../lib/utils";
import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";

export type Task = {
  id: number;
  name: string;
  index: number;
};

export type Column = {
  id: number;
  name: string;
  index: number;
  tasks: Task[];
};

type ColumnTaksProps = {
  id: number;
  name: string;
  index: number;
  tasks: Task[];
  onDropTask: (
    task: Task,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
  ) => void;
  onDropColumn: (col: Column, index_dest: number) => void;
};

export default function ColumnTask({
  id,
  name,
  index,
  tasks,
  onDropTask,
  onDropColumn,
}: ColumnTaksProps) {
  const ref = useRef<HTMLDivElement>(null);
  const columRef = useRef<HTMLDivElement>(null);
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "Column",
      item: { id, name, index, tasks },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 50 : 100,
      }),
    }),
    [id, name, index, tasks]
  );
  const [{ isOver }, dropRef] = useDrop<Column, void, { isOver: boolean }>({
    accept: "Column",
    drop(item: Column) {
      if (item.index !== index) {
        onDropColumn(item, index);
      }
    },
    collect(monitor) {
      const item = monitor.getItem<Column>();
      return {
        isOver: monitor.isOver() && item.id !== id,
      };
    },
  });
  const [, drop] = useDrop(
    () => ({
      accept: "TaskCard",
      drop: (item: Task & { columnId: number }, monitor) => {
        const { columnId, ...task } = item;
        const didDrop = monitor.didDrop();
        if (columnId !== id && !didDrop) {
          onDropTask(task, columnId, id, tasks.length);
        }
      },
    }),
    [id]
  );
  drop(ref);
  dragRef(dropRef(columRef));

  return (
    <>
      {isOver && <div className="mx-1 bg-gray-200 w-2 rounded-lg"></div>}
      <Card ref={columRef}>
        <CardContent
          className={cn(
            "h-full w-64 p-0 overflow-hidden",
            `opacity-${opacity}`
          )}
        >
          <CardHeader className="h-10 mb-2 px-5 py-3 shadow-sm rounded-sm flex flex-row justify-between items-center">
            <span className="text-md">{name}</span>
            <div className="flex flex-row justify-end items-center gap-2">
              <PenIcon size={18} className="text-primary" />
              <Trash2Icon size={18} className="text-primary" />
            </div>
          </CardHeader>
          <div
            ref={ref}
            className="rounded-md w-[95%] mx-auto max-h-[calc(100%-3.5rem)] h-full flex flex-col gap-2 overflow-y-auto scroll-bar"
          >
            {tasks
              .sort((e) => e.index)
              .map((item, index) => (
                <TaskCard
                  id={item.id}
                  key={index}
                  name={item.name}
                  columnId={id}
                  index={index}
                  onDrop={onDropTask}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
