
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import { ProviderSectionHeader } from '../layout';

export interface ProviderInformationPanelProps {
  provider: AdminProvider;
  className?: string;
}

export function ProviderInformationPanel({
  provider,
  className,
}: ProviderInformationPanelProps) {
  const description = provider.description?.trim();

  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Provider Information"
        description="Business-facing information recorded for this payment provider."
      />

      <div className="rounded-lg border border-[var(--border)] bg-[var(--background-muted)] p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Description
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
          {description ||
            'No description has been provided for this provider.'}
        </p>
      </div>
    </Card>
  );
}
