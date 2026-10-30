
import { Badge } from '@/components/ui';

import type { BadgeSize, BadgeVariant } from '@/components/ui';

import type { AdminProviderStatus } from '@/features/admin/finance/providers';

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

const statusPresentation: Record<
  AdminProviderStatus,
  {
    label: string;
    variant: BadgeVariant;
  }
> = {
  NOT_CONFIGURED: {
    label: 'Not Configured',
    variant: 'default',
  },

  CONFIGURING: {
    label: 'Configuring',
    variant: 'warning',
  },

  READY: {
    label: 'Ready',
    variant: 'success',
  },

  DEGRADED: {
    label: 'Degraded',
    variant: 'warning',
  },

  SUSPENDED: {
    label: 'Suspended',
    variant: 'danger',
  },
};

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ProviderStatusBadgeProps {
  status: AdminProviderStatus;
  size?: BadgeSize;
  className?: string;
}

// -----------------------------------------------------------------------------
// Provider Status Badge
// -----------------------------------------------------------------------------

export function ProviderStatusBadge({
  status,
  size = 'sm',
  className,
}: ProviderStatusBadgeProps) {
  const presentation = statusPresentation[status];

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
