/* eslint-disable no-unused-vars */
"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { ColumnsData, TaskData } from "@repo/shared-types";
import { Plus, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { cn } from "../../../lib/utils";
import TaskCard from "./task-card";
import TaksCreateSheet from "./task-create-sheet";

type ColumnTaksProps = {
  id: number;
  name: string;
  index: number;
  tasks: TaskData[];
  onDropTask: (
    task: TaskData,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
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
  const t = useTranslations();
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
  const [{ isOver }, dropRef] = useDrop<ColumnsData, void, { isOver: boolean }>(
    {
      accept: "Column",
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
    }
  );
  const [, drop] = useDrop(
    () => ({
      accept: "TaskCard",
      drop: (item: TaskData & { columnId: number }, monitor) => {
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

  const openTaskSheet = () => {
    setOpen(true);
  };

  const addTask = (task: TaskData) => {
    onDropTask(task, 0, id, tasks.length);
  };

  return (
    <>
      {isOver && <div className="mx-1 bg-gray-100 w-2 rounded-lg"></div>}
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
      <TaksCreateSheet
        open={open}
        onClose={() => setOpen(false)}
        columnId={id}
        onAddTask={addTask}
      />
    </>
  );
}
