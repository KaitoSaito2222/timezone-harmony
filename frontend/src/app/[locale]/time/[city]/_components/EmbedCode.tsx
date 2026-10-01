'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

interface Props {
  /** Absolute URL of the embeddable widget. */
  src: string;
  title: string;
}

export function EmbedCode({ src, title }: Props) {
  const t = useTranslations('cityTime');
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="${src}" title="${title}" width="320" height="170" style="border:0;border-radius:12px" loading="lazy"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      trackEvent('embed_code_copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (insecure context); the code stays selectable.
    }
  };

  return (
    <div>
      <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 text-xs select-all whitespace-pre-wrap break-all">
        {code}
      </pre>
      <Button size="sm" variant="outline" className="mt-2" onClick={copy}>
        {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
        {copied ? t('copied') : t('copyCode')}
      </Button>
    </div>
  );
}
