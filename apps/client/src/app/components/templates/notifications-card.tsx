"use client"

import { Card, CardContent, CardHeader } from "@components/ui/card";

type NotificationCardProps = {
    className?: string;
}

export default function NotificationCard({className} : NotificationCardProps) {
    return (
        <Card className={className}>
          <CardContent>
            <CardHeader className="px-0">Notifications</CardHeader>
                <div className="w-full h-[300px] flex justify-center items-center">
                    <span className="text-gray-400 text-sm">Aucune notification</span>
                </div>
          </CardContent>
        </Card>
    )
}