// -----------------------------------------------------------------------------
// sisiMove — Member Verification Card
// -----------------------------------------------------------------------------
//
// Presentation-only member verification surface.
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
// Visual language:
// - The member verification heading remains outside the requirement card.
// - The requirement list is the only card/surface owned here.
// - SisiMove blue identifies the member verification pathway.
// - Semantic success state is used only when verification is granted.
// - Requirement rows remain responsible for their own status presentation.
// - Mobile-first layout keeps the state and action easy to scan and reach.
//
// -----------------------------------------------------------------------------
//
// Layout:
//
//     Member verification
//     Verify your identity...
//     [Not verified] [Manage]
//
//     ┌──────────────────────────────────────────────────────────────┐
//     │ Profile photo                         Not started             │
//     │ A clear photo of you                                      │
//     ├──────────────────────────────────────────────────────────────┤
//     │ Government ID                         Not started             │
//     │ Government-issued identification                         │
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

export interface MemberVerificationCardProps {
  /**
   * Verification requirements currently relevant to the traveller.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Whether the traveller currently holds member-level verification.
   *
   * This value is supplied by the parent and is intentionally not inferred
   * from the individual requirement rows.
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
  // ---------------------------------------------------------------------------
  // Member Requirements
  // ---------------------------------------------------------------------------
  //
  // Member verification currently presents only the requirements belonging
  // to the member verification pathway.
  //
  // This is a presentation filter, not an eligibility calculation.
  //
  // VerificationRequirement does not expose a separate public requirement ID,
  // so the requirement type is the stable identity within this presentation
  // collection.
  //

  const memberRequirements = requirements.filter(
    (requirement) =>
      requirement.type === 'PROFILE_PHOTO' ||
      requirement.type === 'GOVERNMENT_ID',
  );

  return (
    <div className="space-y-4">
      {/* ---------------------------------------------------------------------
          Member Verification Header
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
              Member verification
            </h3>
          </div>

          <p className="mt-1.5 max-w-xl text-sm leading-5 text-[var(--foreground-secondary)]">
            Verify your identity to build trust and unlock protected
            sisiMove marketplace actions.
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
                ? 'Member verification: Verified'
                : 'Member verification: Not verified'
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
          Requirements Card
         ---------------------------------------------------------------------
         
         Only the actual verification requirements receive card treatment.
         This keeps the member verification heading visually independent and
         avoids a large nested card around the entire verification block.
         --------------------------------------------------------------------- */}

      {memberRequirements.length > 0 ? (
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
            {memberRequirements.map((requirement) => (
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
          No member verification requirements are currently available.
        </div>
      )}
    </div>
  );
}