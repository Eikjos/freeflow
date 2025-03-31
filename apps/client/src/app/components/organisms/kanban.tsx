"use client";

import ColumnTask from "@components/templates/colum-task";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
export default function Kanban() {
  const column = [
    {
      id: 1,
      name: "TEST 1",
    },
    {
      id: 2,
      name: "TEST 1",
    },
    {
      id: 3,
      name: "TEST 1",
    },
    {
      id: 4,
      name: "TEST 1",
    },
  ];
  const tasks = [
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-[calc(100vh-200px)]  max-h-[calc(100vh-200px)] py-4 flex flex-row w-full gap-5">
        {column.map((item, index) => (
          <ColumnTask
            id={item.id}
            key={item.id}
            name={item.name}
            tasks={[...tasks.slice(index, index + 1)]}
          />
        ))}
      </div>
    </DndProvider>
  );
}
