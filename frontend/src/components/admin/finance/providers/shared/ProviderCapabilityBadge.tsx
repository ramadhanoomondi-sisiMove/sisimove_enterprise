
import { Badge } from '@/components/ui';
import type { BadgeSize, BadgeVariant } from '@/components/ui';
import type { AdminProviderCapabilityType } from '@/features/admin/finance/providers';

const capabilityPresentation: Record<
  AdminProviderCapabilityType,
  { label: string; variant: BadgeVariant }
> = {
  INITIATE_PAYMENT: {
    label: 'Initiate Payment',
    variant: 'brand',
  },
  VERIFY_PAYMENT: {
    label: 'Verify Payment',
    variant: 'default',
  },
  QUERY_PAYMENT: {
    label: 'Query Payment',
    variant: 'default',
  },
  REFUND_PAYMENT: {
    label: 'Refund Payment',
    variant: 'warning',
  },
  INITIATE_DISBURSEMENT: {
    label: 'Initiate Disbursement',
    variant: 'brand',
  },
  VERIFY_DISBURSEMENT: {
    label: 'Verify Disbursement',
    variant: 'default',
  },
  QUERY_BALANCE: {
    label: 'Query Balance',
    variant: 'default',
  },
  WEBHOOKS: {
    label: 'Webhooks',
    variant: 'outline',
  },
};

export interface ProviderCapabilityBadgeProps {
  capabilityType: AdminProviderCapabilityType;
  size?: BadgeSize;
  className?: string;
}

export function ProviderCapabilityBadge({
  capabilityType,
  size = 'sm',
  className,
}: ProviderCapabilityBadgeProps) {
  const presentation = capabilityPresentation[capabilityType];

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
