// -----------------------------------------------------------------------------
// Path: src/features/verification/components/shared/verification-status-badge.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Status Badge
//
// Responsibility
// --------------
// Pure presentation component for displaying the lifecycle status of a
// Verification aggregate.
//
// This component deliberately renders STATUS, not VERIFICATION LEVEL.
//
// Verification level answers:
//     "What has this member been verified for?"
//     NONE | MEMBER | DRIVER
//
// Verification status answers:
//     "What is the state of the verification process?"
//     PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED
//
// The two concepts must remain separate.
//
// The component does NOT:
// - fetch verification state
// - submit verification requests
// - cancel requests
// - infer a level from a status
// - perform authorization
// - navigate
//
// All colors come from the frozen sisiMove global design tokens.
// -----------------------------------------------------------------------------

import type { VerificationStatus } from '@/features/verification/models/verification';

export interface VerificationStatusBadgeProps {
  readonly status: VerificationStatus;
  readonly className?: string;
}

interface StatusPresentation {
  readonly label: string;
  readonly className: string;
  readonly indicatorClassName: string;
}

const STATUS_PRESENTATION: Record<
  VerificationStatus,
  StatusPresentation
> = {
  PENDING: {
    label: 'Pending',
    className: [
      'border-[var(--warning)]',
      'bg-[var(--warning-soft)]',
      'text-[var(--warning)]',
    ].join(' '),
    indicatorClassName: 'bg-[var(--warning)]',
  },

  VERIFIED: {
    label: 'Verified',
    className: [
      'border-[var(--success)]',
      'bg-[var(--success-soft)]',
      'text-[var(--success)]',
    ].join(' '),
    indicatorClassName: 'bg-[var(--success)]',
  },

  REJECTED: {
    label: 'Rejected',
    className: [
      'border-[var(--danger)]',
      'bg-[var(--danger-soft)]',
      'text-[var(--danger)]',
    ].join(' '),
    indicatorClassName: 'bg-[var(--danger)]',
  },

  EXPIRED: {
    label: 'Expired',
    className: [
      'border-[var(--danger)]',
      'bg-[var(--danger-soft)]',
      'text-[var(--danger)]',
    ].join(' '),
    indicatorClassName: 'bg-[var(--danger)]',
  },

  REVOKED: {
    label: 'Revoked',
    className: [
      'border-[var(--danger)]',
      'bg-[var(--danger-soft)]',
      'text-[var(--danger)]',
    ].join(' '),
    indicatorClassName: 'bg-[var(--danger)]',
  },
};

function joinClassNames(
  ...classNames: Array<string | undefined | false>
): string {
  return classNames.filter(Boolean).join(' ');
}

export function VerificationStatusBadge({
  status,
  className,
}: VerificationStatusBadgeProps) {
  const presentation = STATUS_PRESENTATION[status];

  return (
    <span
      aria-label={`Verification status: ${presentation.label}`}
      className={joinClassNames(
        'inline-flex',
        'items-center',
        'gap-1.5',
        'rounded-full',
        'border',
        'px-2.5',
        'py-1',
        'text-xs',
        'font-medium',
        'leading-none',
        presentation.className,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={[
          'size-1.5',
          'shrink-0',
          'rounded-full',
          presentation.indicatorClassName,
        ].join(' ')}
      />

      <span>{presentation.label}</span>
    </span>
  );
}

export default VerificationStatusBadge;

