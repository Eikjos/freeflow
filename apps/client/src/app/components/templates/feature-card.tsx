import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@components/ui/card';
import { cn } from '../../../lib/utils';

type FeatureCardProps = {
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
};

export default function FeatureCard({
  title,
  description,
  icon,
  color,
}: FeatureCardProps) {
  return (
    <Card>
      <CardContent>
        <CardHeader className="pl-0">
          <div className="flex flex-row items-center gap-5">
            <div
              className={cn(
                'h-12 w-12 flex justify-center items-center rounded-md',
              )}
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
            <span className="font-bold text-xl">{title}</span>
          </div>
        </CardHeader>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
