'use client';

import { useEffect } from 'react';
import { ErrorScreen } from '@/components/chrome/error-screen';

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorScreen mode="error" onRetry={retry} />;
}
