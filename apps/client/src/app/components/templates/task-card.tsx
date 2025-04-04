"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import type { Identifier } from "dnd-core";
import { ChevronsUp } from "lucide-react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { cn } from "../../../lib/utils";
import { Task } from "./colum-task";

type TaskCardProps = {
  id: number;
  columnId: number;
  name: string;
  index: number;
  onDrop: (
    task: Task,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
  ) => void;
};

export default function TaskCard({
  id,
  name,
  columnId,
  index,
  onDrop,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "TaskCard",
      item: { id, name, columnId, index },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 50 : 100,
      }),
    }),
    [id, name, columnId, index]
  );
  const [{ handlerId, isOver }, dropRef] = useDrop<
    TaskCardProps,
    void,
    { handlerId: Identifier | null; isOver: boolean }
  >(
    () => ({
      accept: "TaskCard",
      collect(monitor) {
        const item = monitor.getItem<TaskCardProps>();
        return {
          handlerId: monitor.getHandlerId(),
          isOver: monitor.isOver() && item.id !== id,
        };
      },
      drop(item: TaskCardProps) {
        if (item.index !== index || item.columnId !== columnId) {
          onDrop(item, item.columnId, columnId, index);
        }
      },
    }),
    [id, columnId, index]
  );

  dragRef(dropRef(ref));

  return (
    <>
      {isOver && <div className="h-2 bg-gray-100 my-1 rounded-lg"></div>}
      <Card ref={ref} data-handler-id={handlerId}>
        <CardContent
          className={cn(
            "h-20 py-1 px-2 flex flex-col justify-between",
            `opacity-${opacity}`
          )}
        >
          <CardHeader className="p-0">
            <span className={`font-light text-sm`}>
              {name} {id}
            </span>
          </CardHeader>
          <div className="w-full flex flex-row justify-end mb-1 items-center gap-2">
            <div className="bg-gray-200 p-1 rounded-full text-xs">10h</div>
            <ChevronsUp size={15} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
