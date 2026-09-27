// -----------------------------------------------------------------------------
// sisiMove — Support Case Reference
// -----------------------------------------------------------------------------
//
// Presentation of an optional cross-domain reference attached to a Support
// case.
//
// Responsibilities:
// - indicate that the case was associated with another SisiMove record;
// - display the opaque reference information without assuming the referenced
//   domain's route or data model.
//
// Non-responsibilities:
// - fetching the referenced Journey/Booking/Payment/etc.;
// - resolving referenceType into a domain-specific route;
// - validating whether the referenced object still exists.
//
// Unknown or unavailable references remain informational.
//
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui/card';

export interface SupportCaseReferenceProps {
  referenceType?: string;
  referencePublicId?: string;
}

export function SupportCaseReference({
  referenceType,
  referencePublicId,
}: SupportCaseReferenceProps) {
  if (!referenceType || !referencePublicId) {
    return null;
  }

  return (
    <Card
      variant="muted"
      padding="sm"
    >
      <div className="space-y-1">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          Related reference
        </p>

        <p className="text-sm font-medium text-[var(--foreground)]">
          {formatReferenceType(referenceType)}
        </p>

        <p className="break-all text-xs text-[var(--foreground-muted)]">
          {referencePublicId}
        </p>
      </div>
    </Card>
  );
}

function formatReferenceType(referenceType: string): string {
  return referenceType
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}