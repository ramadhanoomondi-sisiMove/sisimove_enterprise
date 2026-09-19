// -----------------------------------------------------------------------------
// sisiMove — Driver Verification Card
// -----------------------------------------------------------------------------
//
// Presentation-only card for driver-level verification.
//
// Driver verification currently consists of:
// - Driver license
//
// Responsibilities:
// - Present driver verification state.
// - Render the driver verification requirement.
// - Expose a presentation-level action for managing verification.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling requests.
// - Determining driver eligibility.
// - Granting or rejecting verification.
//
// Architecture:
// - Consumes the VerificationRequirement application/presentation model.
// - Uses shared Card and Button primitives for consistent design-system
//   behavior.
// - Does not access verification APIs or hooks.
// - Does not construct Asset URLs from assetPublicId.
// - Does not inspect VerificationRequest directly.
// - The `verified` state is supplied by the parent from the Verification
//   aggregate's verification level.
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

export interface DriverVerificationCardProps {
  /**
   * Verification requirements currently relevant to the traveller.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Whether the traveller currently holds driver-level verification.
   *
   * This is supplied by the parent from Verification.level rather than
   * calculated from individual requirement rows.
   */
  readonly verified: boolean;

  /**
   * Presentation-level action for opening driver verification management.
   *
   * The actual workflow remains outside this component.
   */
  readonly onManage?: () => void;
}

// -----------------------------------------------------------------------------
// Driver Verification Card
// -----------------------------------------------------------------------------

export function DriverVerificationCard({
  requirements,
  verified,
  onManage,
}: DriverVerificationCardProps): ReactNode {
  // This card owns only the DRIVER_LICENSE requirement.
  //
  // VerificationRequirement does not have its own publicId. The requirement
  // type is the stable identity of the requirement within this presentation
  // model, while requestPublicId identifies an actual submitted request.
  const driverRequirements = requirements.filter(
    (requirement) => requirement.type === 'DRIVER_LICENSE',
  );

  return (
    <Card
      variant="default"
      padding="none"
      header={
        <>
          <div className="min-w-0">
            <div className="text-base font-semibold text-foreground">
              Driver verification
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Verify your driver credentials before publishing journeys as a
              provider.
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
      {driverRequirements.length > 0 ? (
        <div className="px-5 pb-5">
          {driverRequirements.map((requirement) => (
            <VerificationRequirementRow
              key={requirement.type}
              requirement={requirement}
            />
          ))}
        </div>
      ) : (
        <div className="p-5 text-sm text-muted-foreground">
          No driver verification requirements are available.
        </div>
      )}
    </Card>
  );
}