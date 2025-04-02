"use client";

import ColumnTask, { Task } from "@components/templates/colum-task";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
export default function Kanban() {
  const tasks: Task[] = [
    {
      id: 10,
      name: "Tache de test",
    },
    {
      id: 11,
      name: "Tache de test",
    },
    {
      id: 12,
      name: "Tache de test",
    },
    {
      id: 13,
      name: "Tache de test",
    },
    {
      id: 14,
      name: "Tache de test",
    },
    {
      id: 15,
      name: "Tache de test",
    },
  ];
  const column: { id: number; name: string; tasks: Task[] }[] = [
    {
      id: 1,
      name: "TEST 1",
      tasks: [
        {
          id: 10,
          name: "Tache de test",
        },
        {
          id: 11,
          name: "Tache de test",
        },
        {
          id: 12,
          name: "Tache de test",
        },
      ],
    },
    {
      id: 2,
      name: "TEST 1",
      tasks: [
        {
          id: 12,
          name: "Tache de test",
        },
        {
          id: 13,
          name: "Tache de test",
        },
      ],
    },
    {
      id: 3,
      name: "TEST 1",
      tasks: [
        {
          id: 14,
          name: "Tache de test",
        },
        {
          id: 15,
          name: "Tache de test",
        },
      ],
    },
    {
      id: 4,
      name: "TEST 1",
      tasks: [
        {
          id: 16,
          name: "Tache de test",
        },
        {
          id: 17,
          name: "Tache de test",
        },
      ],
    },
  ];
  const [columns, setColumns] = useState(column);

  const handleDrop = (
    task: Task,
    columnId_src: number,
    columnId_dest: number
  ) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId_src) {
          console.log(col.tasks, task);
          const updatedTasks = col.tasks.filter((t) => t.id !== task.id);
          return { ...col, tasks: updatedTasks };
        }
        if (col.id === columnId_dest) {
          const updatedTasks = [...col.tasks, { ...task }];
          return { ...col, tasks: updatedTasks };
        }
        return col;
      })
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-[calc(100vh-200px)]  max-h-[calc(100vh-200px)] py-4 flex flex-row w-full gap-5">
        {columns.map((item) => (
          <ColumnTask
            id={item.id}
            key={item.id}
            name={item.name}
            tasks={item.tasks}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </DndProvider>
  );
}
