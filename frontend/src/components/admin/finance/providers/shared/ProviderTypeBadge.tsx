
import { Badge } from '@/components/ui';
import type { BadgeSize, BadgeVariant } from '@/components/ui';
import type { AdminProviderType } from '@/features/admin/finance/providers';


const typePresentation: Record<
  AdminProviderType,
  { label: string; variant: BadgeVariant }
> = {
  MOBILE_MONEY: { label: 'Mobile Money', variant: 'brand' },
  BANK: { label: 'Bank', variant: 'default' },
  CARD_PROCESSOR: { label: 'Card Processor', variant: 'outline' },
  PAYMENT_GATEWAY: { label: 'Payment Gateway', variant: 'brand' },
  DIGITAL_WALLET: { label: 'Digital Wallet', variant: 'success' },
  OTHER: { label: 'Other', variant: 'default' },
};

export interface ProviderTypeBadgeProps {
  type: AdminProviderType;
  size?: BadgeSize;
  className?: string;
}

export function ProviderTypeBadge({
  type,
  size = 'sm',
  className,
}: ProviderTypeBadgeProps) {
  const presentation = typePresentation[type];

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
