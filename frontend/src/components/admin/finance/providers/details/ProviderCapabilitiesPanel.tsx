import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import { ProviderSectionHeader } from '../layout';
import { ProviderCapabilityCard } from './ProviderCapabilityCard';

export interface ProviderCapabilitiesPanelProps {
  provider: AdminProvider;
  className?: string;
}

export function ProviderCapabilitiesPanel({
  provider,
  className,
}: ProviderCapabilitiesPanelProps) {
  const capabilities = provider.capabilities ?? [];

  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Provider Capabilities"
        description="Payment and integration functions supported by this provider."
      />

      {capabilities.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {capabilities.map((capability) => (
            <ProviderCapabilityCard
              key={capability.publicId}
              capability={capability}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No capabilities recorded
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Capabilities for this provider have not been added yet.
          </p>
        </div>
      )}
    </Card>
  );
}