import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProviderCapability } from '@/features/admin/finance/providers';

export interface ProviderCapabilityDetailsProps {
  capability: AdminProviderCapability;
  className?: string;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="break-all text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ProviderCapabilityDetails({
  capability,
  className,
}: ProviderCapabilityDetailsProps) {
  return (
    <Card
      variant="outlined"
      padding="lg"
      className={cn('space-y-5', className)}
    >
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Capability Details
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Identification and configuration information for this capability.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DetailItem
          label="Capability ID"
          value={capability.publicId}
        />

        <DetailItem
          label="Capability type"
          value={capability.type}
        />

        <DetailItem
          label="Configuration reference"
          value={
            capability.configurationReference?.trim() ||
            'Not recorded'
          }
        />

        <DetailItem
          label="Created"
          value={capability.createdAt}
        />

        <DetailItem
          label="Last updated"
          value={capability.updatedAt}
        />
      </div>
    </Card>
  );
}