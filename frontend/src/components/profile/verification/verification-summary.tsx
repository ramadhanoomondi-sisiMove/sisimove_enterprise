// -----------------------------------------------------------------------------
// sisiMove — Verification Summary
// -----------------------------------------------------------------------------
//
// Presentation-only summary of the traveller's verification state.
//
// Responsibilities:
// - Display the overall verification level/status.
// - Display member and driver verification cards.
// - Keep verification presentation grouped in one reusable component.
//
// Non-responsibilities:
// - Fetching verification data.
// - Determining verification state.
// - Submitting or cancelling verification requests.
// - Granting or rejecting verification.
//
// Architecture:
// - Consumes the Verification aggregate result and
//   VerificationRequirement presentation models.
// - Uses the shared Card primitive for the aggregate-level status surface.
// - Delegates requirement presentation to the member and driver cards.
// - Does not inspect VerificationRequest directly.
// - Does not derive verification from individual requirement statuses.
// - Verification.level is the authoritative source for the granted
//   verification level.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import type {
  Verification,
  VerificationRequirement,
} from '@/features/verification/models';

import { DriverVerificationCard } from './driver-verification-card';
import { MemberVerificationCard } from './member-verification-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationSummaryProps {
  /**
   * Current aggregate verification state.
   */
  readonly verification: Verification;

  /**
   * Current state of the verification requirements.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Presentation-level action for managing member verification.
   */
  readonly onManageMember?: () => void;

  /**
   * Presentation-level action for managing driver verification.
   */
  readonly onManageDriver?: () => void;
}

// -----------------------------------------------------------------------------
// Verification Level Label
// -----------------------------------------------------------------------------

function getVerificationLabel(
  level: Verification['level'],
): string {
  switch (level) {
    case 'DRIVER':
      return 'Driver verified';

    case 'MEMBER':
      return 'Member verified';

    case 'NONE':
    default:
      return 'Not verified';
  }
}

// -----------------------------------------------------------------------------
// Verification Summary
// -----------------------------------------------------------------------------

export function VerificationSummary({
  verification,
  requirements,
  onManageMember,
  onManageDriver,
}: VerificationSummaryProps): ReactNode {
  // Verification.level represents the highest verification level currently
  // granted by the Verification aggregate.
  //
  // Driver verification implies member verification, so DRIVER is also
  // considered member-verified for presentation purposes.
  const memberVerified =
    verification.level === 'MEMBER' ||
    verification.level === 'DRIVER';

  const driverVerified =
    verification.level === 'DRIVER';

  return (
    <div className="space-y-4">
      <Card
        variant="default"
        padding="md"
      >
        <div className="text-sm text-muted-foreground">
          Verification status
        </div>

        <div className="mt-1 text-lg font-semibold text-foreground">
          {getVerificationLabel(verification.level)}
        </div>

        {verification.rejectionReason !== null ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {verification.rejectionReason}
          </p>
        ) : null}
      </Card>

      <MemberVerificationCard
        requirements={requirements}
        verified={memberVerified}
        onManage={onManageMember}
      />

      <DriverVerificationCard
        requirements={requirements}
        verified={driverVerified}
        onManage={onManageDriver}
      />
    </div>
  );
}