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
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnsData,
  CreateColumnData,
  CreateColumnValidation,
  TaskData,
} from "@repo/shared-types";
import { createColumn, moveTask } from "actions/column";
import { reorderColumns } from "actions/project";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

type KanbanProps = {
  className?: string;
  projectId: number;
  columns: ColumnsData[];
};

export function Board({ className, projectId, columns }: KanbanProps) {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [columnsState, setColumnsState] = useState(columns);
  const [open, setOpen] = useState(false);
  const form = useForm<CreateColumnData>({
    resolver: zodResolver(CreateColumnValidation),
    defaultValues: {
      name: "",
    },
  });
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
    const cols = [...columnsState.filter((p) => p.id !== col.id)];
    cols.splice(index_dest, 0, col);
    const columns = cols.map((c, index) => ({ ...c, index }));
    reorderColumns(projectId, {
      orderedColumnIds: columns.map((c) => c.id),
    }).then(() => {
      setColumnsState((prev) => {
        const cols = [...prev.filter((p) => p.id !== col.id)];
        cols.splice(index_dest, 0, col);
        return cols.map((c, index) => ({ ...c, index }));
      });
    });
  };

  const orderTask = (
    task: TaskData,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
  ) => {
    return columnsState.map((col) => {
      if (col.id === columnId_dest) {
        const isSameColumn = columnId_src === columnId_dest;

        let updatedTasks = col.tasks.filter((t) => t.id !== task.id);
        if (!isSameColumn) {
          updatedTasks = updatedTasks.filter((t) => t.id !== task.id);
        }

        updatedTasks.splice(index_dest, 0, task);

        const reindexedTasks = updatedTasks.map((t, index) => ({
          ...t,
          index,
        }));

        return { ...col, tasks: reindexedTasks };
      }

      if (col.id === columnId_src && columnId_src !== columnId_dest) {
        const updatedTasks = col.tasks
          .filter((t) => t.id !== task.id)
          .map((item, index) => ({
            ...item,
            index,
          }));
        console.log(updatedTasks);
        return { ...col, tasks: updatedTasks };
      }
      return col;
    });
  };

  const handleDropTask = (
    task: TaskData,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number,
    isCreation: boolean = false
  ) => {
    setColumnsState((prev) =>
      orderTask(task, columnId_src, columnId_dest, index_dest)
    );
    // Si ce n'est pas une creation ou update de tache
    if (!isCreation) {
      // Appel de l'api
      moveTask(columnId_dest, task.id, { toPosition: index_dest });
    }

    console.log(columnsState);
  };

  const onSubmitCreateColumn = (values: CreateColumnData) => {
    createColumn(projectId, values)
      .then((res) => {
        if (res) {
          setColumnsState([...columnsState, res]);
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
    setOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-end">
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogTrigger asChild>
          <Button>{t("column.addButton")}</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreateColumn)}>
              <DialogTitle className="text-3xl">
                {t("column.createTitle")}
              </DialogTitle>
              <Input
                type="text"
                placeholder="Nom"
                label="Nom de la colonne"
                {...form.register("name")}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>{t("common.cancel")}</Button>
                </DialogClose>
                <Button type="submit">{t("common.create")}</Button>
              </DialogFooter>
            </form>
          </Form>
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
