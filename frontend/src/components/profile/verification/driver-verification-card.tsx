// -----------------------------------------------------------------------------
// sisiMove — Driver Verification Card
// -----------------------------------------------------------------------------
//
// Presentation-only driver verification surface.
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
// - Uses shared Card and Button primitives.
// - Does not access verification APIs or hooks.
// - Does not construct Asset URLs from assetPublicId.
// - Does not inspect VerificationRequest directly.
// - The `verified` state is supplied by the parent from the Verification
//   aggregate's verification level.
//
// Visual language:
// - Driver verification heading remains outside the requirement card.
// - The requirement list is the only card/surface owned here.
// - Visually aligned with MemberVerificationCard.
// - SisiMove blue identifies the driver verification pathway.
// - Semantic success state is used only when driver verification is granted.
// - Requirement rows remain responsible for their own status presentation.
// - Mobile-first layout keeps the state and management action easy to scan.
//
// -----------------------------------------------------------------------------
//
// Layout:
//
//     Driver verification
//     Verify your driver credentials...
//     [Not verified] [Manage]
//
//     ┌──────────────────────────────────────────────────────────────┐
//     │ Driver license                         Not started            │
//     │ Valid driver licensing                                      │
//     └──────────────────────────────────────────────────────────────┘
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type {
  VerificationRequirement,
} from '@/features/verification/models';

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
   * The actual verification workflow remains outside this component.
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
  // ---------------------------------------------------------------------------
  // Driver Requirements
  // ---------------------------------------------------------------------------
  //
  // This presentation pathway owns only DRIVER_LICENSE.
  //
  // Filtering here is strictly a presentation concern. It does not determine
  // whether the traveller is eligible for driver verification.
  //
  // VerificationRequirement does not have its own publicId. The requirement
  // type is therefore the stable identity within this presentation model.
  // requestPublicId remains opaque and belongs to the verification workflow.
  //

  const driverRequirements = requirements.filter(
    (requirement) => requirement.type === 'DRIVER_LICENSE',
  );

  return (
    <div className="space-y-4">
      {/* ---------------------------------------------------------------------
          Driver Verification Header
         --------------------------------------------------------------------- */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={[
                'size-2 shrink-0 rounded-full',
                verified
                  ? 'bg-[var(--success)]'
                  : 'bg-[var(--brand)]',
              ].join(' ')}
            />

            <h3 className="text-base font-semibold tracking-[-0.01em] text-[var(--foreground)]">
              Driver verification
            </h3>
          </div>

          <p className="mt-1.5 max-w-xl text-sm leading-5 text-[var(--foreground-secondary)]">
            Verify your driver credentials before publishing journeys as a
            provider.
          </p>
        </div>

        {/* -------------------------------------------------------------------
            State + Action
           ------------------------------------------------------------------- */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            sm:justify-end
          "
        >
          <span
            aria-label={
              verified
                ? 'Driver verification: Verified'
                : 'Driver verification: Not verified'
            }
            className={[
              'inline-flex items-center gap-1.5',
              'rounded-full border px-2.5 py-1',
              'text-xs font-medium leading-none whitespace-nowrap',
              verified
                ? 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]'
                : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'size-1.5 shrink-0 rounded-full',
                verified
                  ? 'bg-[var(--success)]'
                  : 'bg-[var(--foreground-subtle)]',
              ].join(' ')}
            />

            {verified ? 'Verified' : 'Not verified'}
          </span>

          {onManage !== undefined ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onManage}
            >
              Manage
            </Button>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Driver Requirement Card
         ---------------------------------------------------------------------
         
         Only the actual driver requirement receives card treatment.
         This keeps the driver verification heading visually independent and
         prevents the entire block from becoming one large nested card.
         --------------------------------------------------------------------- */}

      {driverRequirements.length > 0 ? (
        <Card
          variant="default"
          padding="none"
          className="
            overflow-hidden
            rounded-[var(--radius-2xl)]
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow-sm)]
          "
        >
          <div className="px-4 sm:px-5">
            {driverRequirements.map((requirement) => (
              <VerificationRequirementRow
                key={requirement.type}
                requirement={requirement}
              />
            ))}
          </div>
        </Card>
      ) : (
        <div
          className="
            rounded-[var(--radius-2xl)]
            border
            border-dashed
            border-[var(--border-strong)]
            bg-[var(--background-subtle)]
            px-4
            py-5
            text-sm
            leading-5
            text-[var(--foreground-muted)]
          "
        >
          No driver verification requirements are currently available.
        </div>
      )}
    </div>
  );
}