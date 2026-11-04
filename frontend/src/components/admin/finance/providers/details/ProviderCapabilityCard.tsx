
import { Card, Badge, Button } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProviderCapability } from '@/features/admin/finance/providers';

export interface ProviderCapabilityCardProps {
  capability: AdminProviderCapability;
  onEnable: () => void;
  onDisable: () => void;
  className?: string;
}

function formatCapabilityType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function ProviderCapabilityCard({
  capability,
  onEnable,
  onDisable,
  className,
}: ProviderCapabilityCardProps) {
  return (
    <Card
      variant="outlined"
      padding="md"
      className={cn('space-y-4', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {formatCapabilityType(capability.type)}
        </h3>

        <Badge variant="outline" size="sm">
          {capability.type}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Supported</p>
          <Badge
            size="sm"
            variant={capability.isSupported ? 'success' : 'danger'}
          >
            {capability.isSupported ? 'Yes' : 'No'}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Enabled</p>
          <Badge
            size="sm"
            variant={capability.isEnabled ? 'success' : 'warning'}
          >
            {capability.isEnabled ? 'Yes' : 'No'}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Can be used</p>
          <Badge
            size="sm"
            variant={capability.canBeUsed ? 'success' : 'danger'}
          >
            {capability.canBeUsed ? 'Yes' : 'No'}
          </Badge>
        </div>
      </div>

      <div className="flex justify-end border-t pt-3">
        {capability.isEnabled ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onDisable}
          >
            Disable Capability
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={onEnable}
            disabled={!capability.isSupported}
          >
            Enable Capability
          </Button>
        )}
      </div>
    </Card>
  );
}
