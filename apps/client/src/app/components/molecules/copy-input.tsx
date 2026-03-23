'use client';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/utils';

interface CopyInputProps {
  token: string;
  className?: string;
}

export default function CopyInput({ token, className }: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input value={token} readOnly className="font-mono w-full" />

      <Button variant="outline" size="icon" onClick={copyToClipboard}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
