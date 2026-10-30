
import { Badge } from '@/components/ui';
import type { BadgeSize, BadgeVariant } from '@/components/ui';

export interface ProviderOperationalBadgeProps {
  isOperational: boolean;
  size?: BadgeSize;
  className?: string;
}

export function ProviderOperationalBadge({
  isOperational,
  size = 'sm',
  className,
}: ProviderOperationalBadgeProps) {
  const presentation: {
    label: string;
    variant: BadgeVariant;
  } = isOperational
    ? { label: 'Operational', variant: 'success' }
    : { label: 'Not Operational', variant: 'danger' };

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
