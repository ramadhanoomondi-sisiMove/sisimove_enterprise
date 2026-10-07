// -----------------------------------------------------------------------------
// Path: src/features/verification/components/shared/verification-level-badge.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Level Badge
//
// Responsibility
// --------------
// Pure presentation component for displaying the user's current verification
// level.
//
// The badge intentionally does NOT:
// - fetch verification data
// - perform mutations
// - infer verification state
// - perform authorization
// - navigate
//
// Authorization remains a backend responsibility. This component only renders
// the verification level it receives.
//
// Supported levels:
//     NONE
//     MEMBER
//     DRIVER
//
// Visual language follows the frozen sisiMove design system:
// - Brand blue for active verification levels.
// - Neutral styling for NONE.
// - No arbitrary colors.
// - No gradients.
// - No dark-mode variants.
// -----------------------------------------------------------------------------

import type { VerificationLevel } from '@/features/verification/models/verification';

export interface VerificationLevelBadgeProps {
  readonly level: VerificationLevel;
  readonly className?: string;
}

interface LevelPresentation {
  readonly label: string;
  readonly className: string;
}

const LEVEL_PRESENTATION: Record<VerificationLevel, LevelPresentation> = {
  NONE: {
    label: 'Not verified',
    className: [
      'border-[var(--border)]',
      'bg-[var(--background-subtle)]',
      'text-[var(--foreground-secondary)]',
    ].join(' '),
  },

  MEMBER: {
    label: 'Member verified',
    className: [
      'border-[var(--brand)]',
      'bg-[var(--brand-soft)]',
      'text-[var(--brand)]',
    ].join(' '),
  },

  DRIVER: {
    label: 'Driver verified',
    className: [
      'border-[var(--brand)]',
      'bg-[var(--brand-soft)]',
      'text-[var(--brand)]',
    ].join(' '),
  },
};

function joinClassNames(
  ...classNames: Array<string | undefined | false>
): string {
  return classNames.filter(Boolean).join(' ');
}

export function VerificationLevelBadge({
  level,
  className,
}: VerificationLevelBadgeProps) {
  const presentation = LEVEL_PRESENTATION[level];

  return (
    <span
      aria-label={`Verification level: ${presentation.label}`}
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
          level === 'NONE'
            ? 'bg-[var(--foreground-subtle)]'
            : 'bg-[var(--brand)]',
        ].join(' ')}
      />

      <span>{presentation.label}</span>
    </span>
  );
}

export default VerificationLevelBadge;

