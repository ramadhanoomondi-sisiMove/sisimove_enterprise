// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Type Badge
// -----------------------------------------------------------------------------
//
// Presents the payment-method type without introducing new domain enums.
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

export interface PaymentMethodTypeBadgeProps {
  type: string;
}

function formatLabel(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function PaymentMethodTypeBadge({
  type,
}: PaymentMethodTypeBadgeProps) {
  const label = type.trim() ? formatLabel(type) : 'Unknown type';

  return (
    <Badge variant="outline" size="sm">
      {label}
    </Badge>
  );
}

export default PaymentMethodTypeBadge;