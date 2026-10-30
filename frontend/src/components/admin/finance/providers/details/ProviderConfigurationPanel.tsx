import { Badge, Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import { ProviderSectionHeader } from '../layout';

export interface ProviderConfigurationPanelProps {
  provider: AdminProvider;
  className?: string;
}

export function ProviderConfigurationPanel({
  provider,
  className,
}: ProviderConfigurationPanelProps) {
  const configurationReference =
    provider.configurationReference?.trim();

  const hasConfigurationReference = Boolean(configurationReference);

  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Provider Configuration"
        description="Configuration reference recorded for this payment provider."
      />

      <div className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--background-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Configuration reference
          </p>

          <p className="break-all font-mono text-sm text-foreground">
            {configurationReference || 'Not configured'}
          </p>
        </div>

        <Badge
          size="sm"
          variant={hasConfigurationReference ? 'success' : 'outline'}
        >
          {hasConfigurationReference ? 'Reference recorded' : 'No reference'}
        </Badge>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        This reference identifies the provider configuration. Sensitive
        credentials and secret values should be managed securely and are not
        displayed here.
      </p>
    </Card>
  );
}