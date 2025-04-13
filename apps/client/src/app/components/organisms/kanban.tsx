"use client";

import ColumnTask from "@components/templates/colum-task";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { ColumnsData, TaskData } from "@repo/shared-types";
import { useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cn } from "../../../lib/utils";

type KanbanProps = {
  className?: string;
  columns: ColumnsData[];
};

export function Board({ className, columns }: KanbanProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [columnsState, setColumnsState] = useState(columns);
  const [, drop] = useDrop({
    accept: "Column",
    drop(item: ColumnsData, monitor) {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        handleDropColums(item, columns.length);
      }
    },
  });
  drop(ref);

  const handleDropColums = (col: ColumnsData, index_dest: number) => {
    setColumnsState((prev) => {
      const cols = [...prev.filter((p) => p.id !== col.id)];
      cols.splice(index_dest, 0, col);

      console.log(cols);
      return cols.map((c, index) => ({ ...c, index }));
    });
  };

  const handleDropTask = (
    task: TaskData,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
  ) => {
    setColumnsState((prev) =>
      prev.map((col) => {
        if (col.id === columnId_dest) {
          const updatedTasks = [...col.tasks.filter((t) => t.id !== task.id)];
          updatedTasks.splice(index_dest, 0, task);

          return {
            ...col,
            tasks: updatedTasks.map((t, index) => ({ ...t, index })),
          };
        }
        if (col.id === columnId_src) {
          const updatedTasks = col.tasks
            .filter((t) => t.id !== task.id)
            .map((item, index) => ({
              ...item,
              index,
            }));
          return { ...col, tasks: updatedTasks.sort((e) => e.index) };
        }
        return col;
      })
    );
  };

  return (
    <div className="w-full flex flex-col items-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Ajouter une colonne</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-3xl">
            Créer une nouvelle colonne
          </DialogTitle>
          <Input type="text" placeholder="Nom" label="Nom de la colonne" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Annuler</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Créer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          "py-4 flex flex-row w-full gap-5 overflow-x-auto",
          className
        )}
        ref={ref}
      >
        {columnsState
          .sort((a, b) => a.index - b.index)
          .map((item) => (
            <ColumnTask
              id={item.id}
              key={item.id}
              name={item.name}
              tasks={item.tasks}
              index={item.index}
              onDropTask={handleDropTask}
              onDropColumn={handleDropColums}
            />
          ))}
      </div>
    </div>
  );
}

export default function Kanban({ ...props }: KanbanProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Board {...props} />
    </DndProvider>
  );
}
