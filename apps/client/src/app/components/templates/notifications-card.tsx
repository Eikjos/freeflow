"use client"

import { Card, CardContent, CardHeader } from "@components/ui/card";
import NotificationItemCard from "./notification-item-card";

type NotificationCardProps = {
    className?: string;
}

export default function NotificationCard({className} : NotificationCardProps) {
    return (
        <Card className={className}>
          <CardContent>
            <CardHeader className="px-0">Notifications</CardHeader>
                {/* <div className="w-full h-[300px] flex justify-center items-center">
                    <span className="text-gray-400 text-sm">Aucune notification</span>
                </div> */}
                <div className="w-full h-[300px] flex flex-col items-center p-2 bg-gray-300/10 rounded-md">
                    <NotificationItemCard className="w-full"/>       
                </div>
          </CardContent>
        </Card>
    )
}