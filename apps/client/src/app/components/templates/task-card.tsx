"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { TaskData } from "@repo/shared-types";
import { ChevronsDown, ChevronsUp, Equal } from "lucide-react";
import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { cn } from "../../../lib/utils";
import TaskDetailSheet from "./task-detail-sheet";

type TaskCardProps = {
  task: TaskData;
  onDrop: (
    task: TaskData,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
  ) => void;
  onEdit: (task: TaskData) => void;
  onDelete: (task: TaskData) => void;
};

export default function TaskCard({
  task,
  onDrop,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "TaskCard",
      item: { id: task.id },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 50 : 100,
      }),
    }),
    [task.id]
  );

  dragRef(ref);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {/* {isOver && <div className="h-2 bg-gray-100 my-1 rounded-lg"></div>} */}
      <Card
        ref={ref}
        // data-handler-id={handlerId}
        onClick={handleOpen}
        className="hover:cursor-pointer"
      >
        <CardContent
          className={cn(
            "h-20 py-1 px-2 flex flex-col justify-between",
            `opacity-${opacity}`
          )}
        >
          <CardHeader className="p-0">
            <span className={`font-light text-sm`}>{task.name}</span>
          </CardHeader>
          <div className="w-full flex flex-row justify-end mb-1 items-center gap-2">
            <div className="bg-gray-200 p-1 rounded-full text-xs">
              {task.estimation}h
            </div>
            {task.priority === "HIGH" && <ChevronsUp size={15} color="red" />}
            {task.priority === "MEDIUM" && <Equal size={15} color="green" />}
            {task.priority === "LOW" && <ChevronsDown size={15} color="blue" />}
          </div>
        </CardContent>
      </Card>
      <TaskDetailSheet
        open={open}
        onClose={handleClose}
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
