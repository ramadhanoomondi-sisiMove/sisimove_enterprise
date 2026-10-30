
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import { ProviderSectionHeader } from '../layout';
import { ProviderEnvironmentBadge } from '../shared';

export interface ProviderEnvironmentPanelProps {
  provider: AdminProvider;
  className?: string;
}

export function ProviderEnvironmentPanel({
  provider,
  className,
}: ProviderEnvironmentPanelProps) {
  const isProduction = provider.environment === 'PRODUCTION';

  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Environment"
        description="Deployment environment currently assigned to this payment provider."
      />

      <div className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--background-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Current environment
          </p>

          <p className="text-sm font-semibold text-foreground">
            {isProduction ? 'Production Environment' : 'Sandbox Environment'}
          </p>

          <p className="text-xs text-muted-foreground">
            {isProduction
              ? 'This provider is configured for its live environment.'
              : 'This provider is configured for testing and development.'}
          </p>
        </div>

        <ProviderEnvironmentBadge environment={provider.environment} />
      </div>

      {isProduction && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-sm font-medium text-foreground">
            Live environment
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Changes to this provider may affect live payment operations.
            Verify its configuration before making changes.
          </p>
        </div>
      )}
    </Card>
  );
}
