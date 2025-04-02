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
    index_src: number,
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
  const [{ handlerId }, dropRef] = useDrop<
    TaskCardProps,
    void,
    { handlerId: Identifier | null }
  >(
    () => ({
      accept: "TaskCard",
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      drop(item: TaskCardProps, monitor) {
        if (item.index !== index || item.columnId !== columnId) {
          console.log("drop", item.index, index);
          onDrop(item, item.columnId, item.index, columnId, index);
        }
      },
    }),
    [id, columnId, index]
  );

  dragRef(dropRef(ref));

  return (
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
  );
}
