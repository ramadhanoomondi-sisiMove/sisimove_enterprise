// -----------------------------------------------------------------------------
// sisiMove — Support Case Category
// -----------------------------------------------------------------------------
//
// Domain-aware presentation of Support case category.
//
// The category remains the backend-provided classification. The component only
// translates the enum into human-readable member-facing text.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui/badge';

import type { SupportCaseCategory as SupportCaseCategoryValue } from '@/features/support-case/models';

export interface SupportCaseCategoryProps {
  category: SupportCaseCategoryValue;
}

const categoryLabels: Record<
  SupportCaseCategoryValue,
  string
> = {
  JOURNEY: 'Journey',
  BOOKING: 'Booking',
  PAYMENT: 'Payment',
  WALLET: 'Wallet',
  REFUND: 'Refund',
  TRUST: 'Trust',
  VERIFICATION: 'Verification',
  MESSAGING: 'Messaging',
  ACCOUNT: 'Account',
  SAFETY: 'Safety',
  OTHER: 'Other',
};

export function SupportCaseCategory({
  category,
}: SupportCaseCategoryProps) {
  return (
    <Badge
      variant="outline"
      size="sm"
    >
      {categoryLabels[category]}
    </Badge>
  );
}