'use client';

/**
 * The interactive corner of the design-system page: EmptyState/ErrorState
 * with working (if inert) reset/retry handlers, and the toast playground.
 * Split out from page.tsx because Server Components can't pass function
 * props across the boundary — these handlers have to be defined on the
 * client side of it.
 */
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

export function EmptyStateDemo() {
  return <EmptyState onReset={() => toast({ title: 'Filters cleared', variant: 'info' })} />;
}

export function ErrorStateDemo() {
  return <ErrorState onRetry={() => toast({ title: 'Retrying…', variant: 'info' })} />;
}

export function ToastPlayground() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant="dark"
        size="sm"
        onClick={() =>
          toast({
            title: 'Cabin reserved — SF-26A7K4',
            body: 'Held for 72 hours. The deposit link follows within one working day.',
            variant: 'success',
            action: { label: 'Print confirmation', href: '#feedback' },
          })
        }
      >
        Booking confirmed
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          toast({
            title: 'That did not send',
            body: 'Nothing was charged and your answers are intact. Try again, or message the office.',
            variant: 'error',
          })
        }
      >
        Error
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          toast({
            title: 'Prices now in IDR',
            body: 'Converted at our weekly rate. Your invoice is issued in the currency you choose at checkout.',
            variant: 'info',
          })
        }
      >
        Info
      </Button>
    </div>
  );
}
