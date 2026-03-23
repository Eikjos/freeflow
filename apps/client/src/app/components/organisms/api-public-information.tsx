import SwaggerViewer from '@components/atoms/swagger-viewer';
import CopyInput from '@components/molecules/copy-input';
import { Card, CardContent } from '@components/ui/card';
import Loading from '@components/ui/loading';
import { Separator } from '@components/ui/separator';
import { Suspense } from 'react';
import { getApiToken } from '../../../lib/api/enterprise';

type ApiPublicInformationProps = {
  enterpriseId: number;
};

export default async function ApiPublicInformation({
  enterpriseId,
}: ApiPublicInformationProps) {
  const data = await getApiToken(enterpriseId);
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <Suspense
            fallback={
              <div className="h-full w-full">
                <Loading />
              </div>
            }
          >
            <h2 className="text-lg">Token API</h2>
            <CopyInput token={data.data ?? ''} className="w-full" />
            <Separator className="my-5 bg-secondary" />
            <SwaggerViewer url={`${process.env.API_URL}/public/swagger-json`} />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
