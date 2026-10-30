
import { Badge } from '@/components/ui';
import type { BadgeSize, BadgeVariant } from '@/components/ui';
import type { AdminProviderEnvironment } from '@/features/admin/finance/providers';

const environmentPresentation: Record<
  AdminProviderEnvironment,
  { label: string; variant: BadgeVariant }
> = {
  SANDBOX: { label: 'Sandbox', variant: 'warning' },
  PRODUCTION: { label: 'Production', variant: 'success' },
};

export interface ProviderEnvironmentBadgeProps {
  environment: AdminProviderEnvironment;
  size?: BadgeSize;
  className?: string;
}

export function ProviderEnvironmentBadge({
  environment,
  size = 'sm',
  className,
}: ProviderEnvironmentBadgeProps) {
  const presentation = environmentPresentation[environment];

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
