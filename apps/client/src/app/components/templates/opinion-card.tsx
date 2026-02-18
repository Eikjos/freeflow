import StarRating from '@components/molecules/start-rating';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { useTranslations } from 'next-intl';
import NotificationItemCard from './notification-item-card';

type OpinionCardProps = {
  className?: string;
};

export default function OpinionCard({ className }: OpinionCardProps) {
  const t = useTranslations();
  return (
    <Card className={className}>
      <CardContent>
        <CardHeader className="px-0">{t('opinion.last.title')}</CardHeader>

        <div
          className="
              flex 
              md:flex-row
              flex-col
              h-auto 
              lg:h-[300px]
              gap-5
              items-center
            "
        >
          {/* Note globale */}
          <div className="flex justify-center lg:justify-start w-1/3">
            <StarRating readOnly value={4.5} className="w-full" />
          </div>

          {/* Séparateur (visible seulement sur desktop) */}
          <Separator
            orientation="vertical"
            className="h-5/6 rounded-md bg-secondary sm:hidden lg:block justify-center"
          />

          {/* Avis récents */}
          <div className="bg-gray-300/10 rounded-md p-2 h-[250px] lg:h-[300px] w-full">
            <NotificationItemCard />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
