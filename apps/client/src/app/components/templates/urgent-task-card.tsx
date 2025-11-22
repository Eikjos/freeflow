"use client"

import { useQuery } from "@tanstack/react-query";
import { getUrgentTasksQueryOptions } from "../../../lib/api/tasks";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import TaskCard from "./task-card";
import Loading from "@components/ui/loading";
import TaskItemCard from "./task-item-card";

type UrgentTaskCardProps = {
    className?: string;
}

export default function UrgentTaskCard({ className } : UrgentTaskCardProps) {
    const { data, isLoading } = useQuery(getUrgentTasksQueryOptions());

    return (
        <Card className={className}>
          <CardContent>
            <CardHeader className="px-0">Les taches urgentes</CardHeader>
                {isLoading && (
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Loading />
                    </div>
                )}
                {!isLoading && data && data.data && data.data.length > 0 ? (
                    <div className="flex flex-col w-full items-center h-[300px] overflow-y-scroll bg-gray-300/10 p-2 rounded-md">
                        {data.data.map((task, index) => (
                            <TaskItemCard task={task} key={index} className="w-full"></TaskItemCard>
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <span className="text-gray-400 text-sm">Aucune tâches urgentes</span>
                    </div>)}

          </CardContent>
        </Card>
    )
}