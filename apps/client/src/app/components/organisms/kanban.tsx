"use client";

import ColumnTask, { Column, Task } from "@components/templates/colum-task";
import { useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
export function Board() {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "Column",
    drop(item: Column, monitor) {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        handleDropColums(item, columns.length);
      }
    },
  });
  drop(ref);

  const column: Column[] = [
    {
      id: 1,
      name: "TEST 1",
      index: 0,
      tasks: [
        {
          id: 10,
          name: "Tache de test",
          index: 1,
        },
        {
          id: 11,
          name: "Tache de test",
          index: 2,
        },
        {
          id: 1,
          name: "Tache de test",
          index: 3,
        },
      ],
    },
    {
      id: 2,
      name: "TEST 2",
      index: 1,
      tasks: [
        {
          id: 12,
          name: "Tache de test",
          index: 1,
        },
        {
          id: 13,
          name: "Tache de test",
          index: 2,
        },
      ],
    },
    {
      id: 3,
      name: "TEST 3",
      index: 2,
      tasks: [
        {
          id: 14,
          name: "Tache de test",
          index: 1,
        },
        {
          id: 15,
          name: "Tache de test",
          index: 2,
        },
      ],
    },
    {
      id: 4,
      name: "TEST 4",
      index: 3,
      tasks: [
        {
          id: 16,
          name: "Tache de test",
          index: 1,
        },
        {
          id: 17,
          name: "Tache de test",
          index: 2,
        },
      ],
    },
  ];
  const [columns, setColumns] = useState<Column[]>(column);

  const handleDropColums = (col: Column, index_dest: number) => {
    setColumns((prev) => {
      const cols = [...prev.filter((p) => p.id !== col.id)];
      cols.splice(index_dest, 0, col);

      console.log(cols);
      return cols.map((c, index) => ({ ...c, index }));
    });
  };

  const handleDropTask = (
    task: Task,
    columnId_src: number,
    columnId_dest: number,
    index_dest: number
  ) => {
    setColumns((prev) =>
      prev.map((col) => {
        console.log(col);
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
    <div
      className="min-h-[calc(100vh-200px)]  max-h-[calc(100vh-200px)] py-4 flex flex-row w-full gap-5"
      ref={ref}
    >
      {columns
        .sort((c) => c.index)
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
  );
}

export default function Kanban() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Board />
    </DndProvider>
  );
}
