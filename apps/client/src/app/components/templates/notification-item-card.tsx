import { Card, CardContent, CardHeader } from '@components/ui/card'
import { cn } from '../../../lib/utils'

type NotificationItemCardProps = {
  className?: string
}

export default function NotifcationItemCard({
  className,
}: NotificationItemCardProps) {
  return (
    <Card className={cn('h-20', className)}>
      <CardContent className="p-1 relative">
        <CardHeader className="p-1 text-primary">
          Altitude Infra Exploitation
        </CardHeader>
        <span className="text-sm pl-2">N'a pas encore viré Kevin Biojout.</span>
        <div className="h-2 w-2 bg-secondary rounded-full absolute top-1/2 right-5"></div>
      </CardContent>
    </Card>
  )
}
