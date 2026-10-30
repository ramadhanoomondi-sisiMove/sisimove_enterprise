import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import { ProviderSectionHeader } from '../layout';

export interface ProviderIntegrationPanelProps {
  provider: AdminProvider;
  className?: string;
}

export function ProviderIntegrationPanel({
  provider,
  className,
}: ProviderIntegrationPanelProps) {
  const configurationReference =
    provider.configurationReference?.trim();

  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Provider Integration"
        description="Integration reference associated with this payment provider."
      />

      <div className="rounded-lg border border-[var(--border)] bg-[var(--background-muted)] p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Configuration reference
        </p>

        {configurationReference ? (
          <p className="mt-2 break-all font-mono text-sm text-foreground">
            {configurationReference}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No configuration reference has been recorded.
          </p>
        )}
      </div>
    </Card>
  );
}