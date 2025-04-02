"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { useRef } from "react";
import { useDrag } from "react-dnd";

type TaskCardProps = {
  id: number;
  columnId: number;
  name: string;
};

export default function TaskCard({ id, name, columnId }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "TaskCard",
      item: { id, name, columnId },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 50 : 100,
      }),
    }),
    [id, name, columnId]
  );
  dragRef(ref);

  return (
    <Card ref={ref}>
      <CardContent className="h-16 p-4">
        <CardHeader className="p-0">
          <span className={`font-semibold text-md opacity-${opacity}`}>
            {name}
          </span>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
