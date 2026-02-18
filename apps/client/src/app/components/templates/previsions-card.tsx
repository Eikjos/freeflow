import { Card, CardContent, CardHeader } from '@components/ui/card';
import { useTranslations } from 'next-intl';
import { cn } from '../../../lib/utils';
import PrevisionCAChart from './prevision-chart';

type PrevisionsCardProps = {
  className?: string;
};

export default function PrevisionsCard({ className }: PrevisionsCardProps) {
  const t = useTranslations();

  return (
    <Card className={cn(className)}>
      <CardContent className="p-0">
        <CardHeader>{t('sales.previsionTitle')}</CardHeader>
        <PrevisionCAChart className="mx-3" />
      </CardContent>
    </Card>
  );
}
