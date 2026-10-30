// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Default Badge
// -----------------------------------------------------------------------------
//
// Highlights whether a payment method is the account's default.
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

export interface PaymentMethodDefaultBadgeProps {
  isDefault: boolean;
}

export function PaymentMethodDefaultBadge({
  isDefault,
}: PaymentMethodDefaultBadgeProps) {
  if (!isDefault) {
    return null;
  }

  return (
    <Badge variant="brand" size="sm">
      Default
    </Badge>
  );
}

export default PaymentMethodDefaultBadge;