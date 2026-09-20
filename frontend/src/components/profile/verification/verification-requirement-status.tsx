// -----------------------------------------------------------------------------
// sisiMove — Verification Requirement Status
// -----------------------------------------------------------------------------
//
// Presentation-only status indicator for one verification requirement.
//
// Responsibilities:
// - Display the current verification requirement status.
// - Provide consistent semantic visual treatment for each known status.
// - Keep status presentation compact and suitable for requirement rows.
//
// Non-responsibilities:
// - Determining verification status.
// - Submitting verification requests.
// - Fetching verification data.
// - Performing verification actions.
//
// Architecture:
// - Consumes the VerificationRequirementStatus presentation model.
// - Maps domain/application status values to human-readable UI labels.
// - Contains no API, hook, mutation, or verification workflow logic.
//
// Visual language:
// - Compact pill suitable for dense verification requirement lists.
// - Uses sisiMove semantic design tokens.
// - Status color communicates meaning through both text and a status dot.
// - Neutral states remain visually quiet.
// - Semantic states use success, warning, and danger tokens only where
//   they communicate meaningful verification lifecycle information.
// - No generic shadcn muted/destructive utility classes.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type {
  VerificationRequirementStatus as VerificationRequirementStatusValue,
} from '@/features/verification/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationRequirementStatusProps {
  /**
   * Current status of the verification requirement.
   *
   * This value is supplied by the verification read model and is not
   * interpreted beyond its presentation mapping below.
   */
  readonly status: VerificationRequirementStatusValue;
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

interface StatusPresentation {
  readonly label: string;
  readonly className: string;
  readonly dotClassName: string;
}

function getStatusPresentation(
  status: VerificationRequirementStatusValue,
): StatusPresentation {
  switch (status) {
    // -------------------------------------------------------------------------
    // Requirement has not yet entered the verification workflow.
    // -------------------------------------------------------------------------

    case 'NOT_STARTED':
      return {
        label: 'Not started',
        className:
          'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
        dotClassName:
          'bg-[var(--foreground-subtle)]',
      };

    // -------------------------------------------------------------------------
    // Requirement has been submitted and is awaiting review.
    // -------------------------------------------------------------------------

    case 'PENDING':
      return {
        label: 'Pending review',
        className:
          'border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]',
        dotClassName:
          'bg-[var(--warning)]',
      };

    // -------------------------------------------------------------------------
    // Requirement has been approved.
    // -------------------------------------------------------------------------

    case 'APPROVED':
      return {
        label: 'Verified',
        className:
          'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]',
        dotClassName:
          'bg-[var(--success)]',
      };

    // -------------------------------------------------------------------------
    // Requirement was rejected and may require attention.
    // -------------------------------------------------------------------------

    case 'REJECTED':
      return {
        label: 'Rejected',
        className:
          'border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]',
        dotClassName:
          'bg-[var(--danger)]',
      };

    // -------------------------------------------------------------------------
    // Requirement was cancelled.
    // -------------------------------------------------------------------------

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        className:
          'border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground-muted)]',
        dotClassName:
          'bg-[var(--foreground-subtle)]',
      };

    // -------------------------------------------------------------------------
    // Defensive presentation fallback.
    //
    // The backend/application model remains authoritative. This fallback
    // prevents an unexpected value from producing an unstyled UI state.
    // -------------------------------------------------------------------------

    default:
      return {
        label: 'Unknown',
        className:
          'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
        dotClassName:
          'bg-[var(--foreground-subtle)]',
      };
  }
}

// -----------------------------------------------------------------------------
// Verification Requirement Status
// -----------------------------------------------------------------------------

export function VerificationRequirementStatus({
  status,
}: VerificationRequirementStatusProps): ReactNode {
  const presentation = getStatusPresentation(status);

  return (
    <span
      aria-label={`Verification status: ${presentation.label}`}
      className={[
        'inline-flex shrink-0 items-center gap-1.5',
        'rounded-full border px-2.5 py-1',
        'text-xs font-medium leading-none',
        'whitespace-nowrap',
        presentation.className,
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'size-1.5 shrink-0 rounded-full',
          presentation.dotClassName,
        ].join(' ')}
      />

      {presentation.label}
    </span>
  );
}