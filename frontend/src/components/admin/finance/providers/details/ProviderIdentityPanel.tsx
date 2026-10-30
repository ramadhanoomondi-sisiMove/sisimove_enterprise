import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import {
  ProviderCode,
  ProviderName,
  ProviderPublicId,
  ProviderTypeBadge,
} from '../shared';
import { ProviderSectionHeader } from '../layout';

export interface ProviderIdentityPanelProps {
  provider: AdminProvider;
  className?: string;
}

export function ProviderIdentityPanel({
  provider,
  className,
}: ProviderIdentityPanelProps) {
  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Provider Identity"
        description="Core identifiers used to recognize this payment provider."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Provider name
          </p>
          <ProviderName name={provider.name} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Provider code
          </p>
          <ProviderCode code={provider.code} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Public ID
          </p>
          <ProviderPublicId publicId={provider.publicId} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Provider type
          </p>
          <ProviderTypeBadge type={provider.type} />
        </div>
      </div>
    </Card>
  );
}