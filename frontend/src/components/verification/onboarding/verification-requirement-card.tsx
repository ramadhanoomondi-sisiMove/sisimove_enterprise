'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/onboarding/verification-requirement-card.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Requirement Card
//
// Dependency level: 1
//
// Responsibility
// --------------
// Presents one VerificationRequirement.
//
// This component is intentionally presentation-only.
//
// It does NOT:
// - fetch Verification;
// - fetch Verification Requests;
// - submit verification requests;
// - cancel requests;
// - upload assets;
// - determine eligibility;
// - determine which requirements are required;
// - calculate requirement lifecycle state;
// - perform navigation.
//
// The parent supplies the complete VerificationRequirement model.
//
// Selection
// ---------
// The card may expose a selection action for requirements whose supplied
// lifecycle state permits another submission:
//
//     NOT_STARTED → Submit
//     REJECTED    → Resubmit
//     CANCELLED   → Submit again
//
// PENDING and APPROVED requirements are informational and therefore do not
// expose a submission action.
//
// The card does not perform the submission itself. It only reports selection
// through the supplied onSelect callback.
//
// Design system
// -------------
// All visual styling uses the frozen sisiMove design tokens.
// No arbitrary colors, gradients, or dark-mode styling are introduced.
// -----------------------------------------------------------------------------

import type { VerificationRequirement } from '@/features/verification/models/verification-requirement';

// =============================================================================
// Props
// =============================================================================

export interface VerificationRequirementCardProps {
  readonly requirement: VerificationRequirement;

  /**
   * Called when the user selects this requirement for further action.
   *
   * The owning workflow decides what happens after selection.
   */
  readonly onSelect?: (
    requirement: VerificationRequirement,
  ) => void;
}

// =============================================================================
// Requirement presentation
// =============================================================================

function getRequirementLabel(
  type: VerificationRequirement['type'],
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'Profile photo';

    case 'GOVERNMENT_ID':
      return 'Government ID';

    case 'DRIVER_LICENSE':
      return 'Driver license';

    default:
      return type;
  }
}

function getRequirementDescription(
  type: VerificationRequirement['type'],
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'Add a clear photo of yourself for your verified profile.';

    case 'GOVERNMENT_ID':
      return 'Submit a valid government-issued identification document.';

    case 'DRIVER_LICENSE':
      return 'Submit your valid driving license to verify your driver status.';

    default:
      return 'Complete this verification requirement.';
  }
}

// =============================================================================
// Status presentation
// =============================================================================

function getStatusLabel(
  status: VerificationRequirement['status'],
): string {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not started';

    case 'PENDING':
      return 'Under review';

    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Needs attention';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
}

function getStatusClassName(
  status: VerificationRequirement['status'],
): string {
  switch (status) {
    case 'APPROVED':
      return [
        'border-[var(--success)]',
        'bg-[var(--success-soft)]',
        'text-[var(--success)]',
      ].join(' ');

    case 'PENDING':
      return [
        'border-[var(--warning)]',
        'bg-[var(--warning-soft)]',
        'text-[var(--warning)]',
      ].join(' ');

    case 'REJECTED':
      return [
        'border-[var(--danger)]',
        'bg-[var(--danger-soft)]',
        'text-[var(--danger)]',
      ].join(' ');

    case 'CANCELLED':
      return [
        'border-[var(--border)]',
        'bg-[var(--background-muted)]',
        'text-[var(--foreground-muted)]',
      ].join(' ');

    case 'NOT_STARTED':
    default:
      return [
        'border-[var(--border)]',
        'bg-[var(--background-subtle)]',
        'text-[var(--foreground-secondary)]',
      ].join(' ');
  }
}

// =============================================================================
// Action presentation
// =============================================================================

function getActionLabel(
  status: VerificationRequirement['status'],
): string | null {
  switch (status) {
    case 'NOT_STARTED':
      return 'Submit';

    case 'REJECTED':
      return 'Resubmit';

    case 'CANCELLED':
      return 'Submit again';

    case 'PENDING':
    case 'APPROVED':
      return null;

    default:
      return null;
  }
}

function isSelectableStatus(
  status: VerificationRequirement['status'],
): boolean {
  switch (status) {
    case 'NOT_STARTED':
    case 'REJECTED':
    case 'CANCELLED':
      return true;

    case 'PENDING':
    case 'APPROVED':
      return false;

    default:
      return false;
  }
}

// =============================================================================
// Component
// =============================================================================

export function VerificationRequirementCard({
  requirement,
  onSelect,
}: VerificationRequirementCardProps) {
  const label = getRequirementLabel(
    requirement.type,
  );

  const description = getRequirementDescription(
    requirement.type,
  );

  const statusLabel = getStatusLabel(
    requirement.status,
  );

  const actionLabel = getActionLabel(
    requirement.status,
  );

  const isSelectable =
    Boolean(onSelect) &&
    isSelectableStatus(requirement.status);

  return (
    <article
      className={[
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'shadow-[var(--shadow-sm)]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ------------------------------------------------------------------ */}
        {/* Requirement information                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {label}
            </h3>

            {requirement.required && (
              <span className="text-xs font-medium text-[var(--foreground-muted)]">
                Required
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
            {description}
          </p>

          {/* -------------------------------------------------------------- */}
          {/* Rejection reason                                                */}
          {/* -------------------------------------------------------------- */}

          {requirement.status === 'REJECTED' &&
            requirement.rejectionReason && (
              <p className="mt-2 text-sm text-[var(--danger)]">
                {requirement.rejectionReason}
              </p>
            )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Status / action                                                     */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex shrink-0 items-center gap-3">
          <span
            className={[
              'rounded-[var(--radius-full)]',
              'border px-2.5 py-1',
              'text-xs font-medium',
              getStatusClassName(requirement.status),
            ].join(' ')}
          >
            {statusLabel}
          </span>

          {actionLabel && isSelectable && (
            <button
              type="button"
              onClick={() => {
                onSelect?.(requirement);
              }}
              className={[
                'rounded-[var(--radius-md)]',
                'border border-[var(--brand)]',
                'bg-[var(--brand)]',
                'px-3 py-2',
                'text-sm font-medium',
                'text-[var(--brand-foreground)]',
                'transition-colors',
                'hover:bg-[var(--brand-hover)]',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--brand)]',
                'focus-visible:outline-offset-2',
              ].join(' ')}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

