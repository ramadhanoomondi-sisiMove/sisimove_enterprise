// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Status Badge
// -----------------------------------------------------------------------------
//
// Presents the active/inactive lifecycle state using the shared Badge primitive.
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

export interface PaymentMethodStatusBadgeProps {
  isActive: boolean;
}

export function PaymentMethodStatusBadge({
  isActive,
}: PaymentMethodStatusBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'danger'} size="sm">
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}

export default PaymentMethodStatusBadge;