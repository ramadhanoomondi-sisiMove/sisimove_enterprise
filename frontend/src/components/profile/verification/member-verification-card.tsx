// -----------------------------------------------------------------------------
// sisiMove — Member Verification Card
// -----------------------------------------------------------------------------
//
// Presentation-only card for the verification requirements that establish
// member-level verification.
//
// Member verification currently consists of:
// - Profile photo
// - Government ID
//
// Responsibilities:
// - Present member verification state.
// - Render the relevant verification requirement rows.
// - Expose a presentation-level action for managing verification.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling verification requests.
// - Determining verification eligibility.
//
// Architecture:
// - Consumes the VerificationRequirement presentation model.
// - Uses shared Card and Button primitives.
// - Does not access verification APIs or hooks.
// - Does not inspect VerificationRequest directly.
// - Does not construct Asset URLs.
// - `verified` is supplied by the parent from the Verification aggregate's
//   verification level.
//
// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { VerificationRequirement } from '@/features/verification/models';

import { VerificationRequirementRow } from './verification-requirement-row';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberVerificationCardProps {
  /**
   * Verification requirements currently relevant to the traveller.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Whether the traveller currently holds member-level verification.
   *
   * This is supplied by the parent rather than calculated from the individual
   * requirement rows.
   */
  readonly verified: boolean;

  /**
   * Presentation-level action for opening member verification management.
   *
   * The actual verification workflow remains outside this component.
   */
  readonly onManage?: () => void;
}

// -----------------------------------------------------------------------------
// Member Verification Card
// -----------------------------------------------------------------------------

export function MemberVerificationCard({
  requirements,
  verified,
  onManage,
}: MemberVerificationCardProps): ReactNode {
  // Member verification is established through these two requirements.
  //
  // VerificationRequirement does not have its own publicId. The requirement
  // type is therefore the stable identity within this presentation model.
  const memberRequirements = requirements.filter(
    (requirement) =>
      requirement.type === 'PROFILE_PHOTO' ||
      requirement.type === 'GOVERNMENT_ID',
  );

  return (
    <Card
      variant="default"
      padding="none"
      header={
        <>
          <div className="min-w-0">
            <div className="text-base font-semibold text-foreground">
              Member verification
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Verify your identity to access protected sisiMove marketplace
              actions.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {verified ? 'Verified' : 'Not verified'}
            </span>

            {onManage !== undefined ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onManage}
              >
                Manage
              </Button>
            ) : null}
          </div>
        </>
      }
    >
      {memberRequirements.length > 0 ? (
        <div className="px-5 pb-5">
          {memberRequirements.map((requirement) => (
            <VerificationRequirementRow
              key={requirement.type}
              requirement={requirement}
            />
          ))}
        </div>
      ) : (
        <div className="p-5 text-sm text-muted-foreground">
          No member verification requirements are available.
        </div>
      )}
    </Card>
  );
}