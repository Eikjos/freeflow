import StarRating from '@components/molecules/start-rating';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@components/ui/card';
import { OpinionData } from '@repo/shared-types';

type OpinionItemCardProps = {
  opinion: OpinionData;
  className?: string;
};

export default function OpinionItemCard({
  opinion,
  className,
}: OpinionItemCardProps) {
  return (
    <Card className={className}>
      <CardContent className="py-4">
        <div className="flex flex-row justify-between items-center gap-10">
          <div>
            <CardHeader className="p-0 text-primary">
              {opinion.customer}
            </CardHeader>
            <CardDescription className="min-h-10">
              {opinion.content}
            </CardDescription>
          </div>
          <StarRating readOnly value={opinion.rate} />
        </div>
      </CardContent>
    </Card>
  );
}
