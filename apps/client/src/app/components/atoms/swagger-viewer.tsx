'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type SwaggerViewProps = {
  url: string;
};

export default function SwaggerViewer({ url }: SwaggerViewProps) {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <SwaggerUI url={url} />
    </div>
  );
}
