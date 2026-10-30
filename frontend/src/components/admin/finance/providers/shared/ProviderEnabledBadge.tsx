
import { Badge } from '@/components/ui';
import type { BadgeSize, BadgeVariant } from '@/components/ui';

export interface ProviderEnabledBadgeProps {
  isEnabled: boolean;
  size?: BadgeSize;
  className?: string;
}

export function ProviderEnabledBadge({
  isEnabled,
  size = 'sm',
  className,
}: ProviderEnabledBadgeProps) {
  const presentation: {
    label: string;
    variant: BadgeVariant;
  } = isEnabled
    ? { label: 'Enabled', variant: 'success' }
    : { label: 'Disabled', variant: 'default' };

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
