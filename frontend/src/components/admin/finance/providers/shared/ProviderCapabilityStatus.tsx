
import { Badge } from '@/components/ui';
import type { BadgeSize, BadgeVariant } from '@/components/ui';

export interface ProviderCapabilityStatusProps {
  isSupported: boolean;
  isEnabled: boolean;
  canBeUsed: boolean;
  size?: BadgeSize;
  className?: string;
}

export function ProviderCapabilityStatus({
  isSupported,
  isEnabled,
  canBeUsed,
  size = 'sm',
  className,
}: ProviderCapabilityStatusProps) {
  let presentation: {
    label: string;
    variant: BadgeVariant;
  };

  if (!isSupported) {
    presentation = {
      label: 'Not Supported',
      variant: 'default',
    };
  } else if (!isEnabled) {
    presentation = {
      label: 'Disabled',
      variant: 'warning',
    };
  } else if (!canBeUsed) {
    presentation = {
      label: 'Unavailable',
      variant: 'danger',
    };
  } else {
    presentation = {
      label: 'Available',
      variant: 'success',
    };
  }

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
    >
      {presentation.label}
    </Badge>
  );
}
