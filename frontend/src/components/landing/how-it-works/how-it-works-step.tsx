// -----------------------------------------------------------------------------
// sisiMove — How It Works Step
// -----------------------------------------------------------------------------
//
// Presentation component for one step in the public "How SisiMove Works"
// experience.
//
// Responsibilities:
// - Display the step marker.
// - Display the step title and description.
// - Render optional leading/trailing presentation content.
//
// This component does NOT:
// - contain business logic;
// - fetch data;
// - manage navigation;
// - perform bookings;
// - depend on domain/application models.
//
// Semantic boundary:
// - The parent HowItWorksSection owns the <ol>/<li> structure.
// - This component renders only the internal presentation of one step.
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface HowItWorksStepProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'title'
  > {
  /**
   * Step number or identifier displayed to the traveller.
   *
   * Examples:
   * - 1
   * - 2
   * - "01"
   */
  step: number | string;

  /**
   * Short step title.
   */
  title: ReactNode;

  /**
   * Explanation of what happens during this step.
   */
  description: ReactNode;

  /**
   * Optional visual displayed in place of the default step marker.
   */
  leadingContent?: ReactNode;

  /**
   * Optional content displayed after the description.
   */
  trailingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatStep(
  step: number | string,
): string {
  if (typeof step === 'number') {
    if (!Number.isFinite(step)) {
      return '';
    }

    return String(
      Math.max(0, Math.trunc(step)),
    ).padStart(2, '0');
  }

  return step.trim();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function HowItWorksStep({
  step,
  title,
  description,
  leadingContent,
  trailingContent,
  className,
  ...props
}: HowItWorksStepProps) {
  const formattedStep = formatStep(step);

  return (
    <div
      className={cn(
        'flex',
        'min-w-0',
        'flex-col',
        className,
      )}
      {...props}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Step marker                                                         */}
      {/* ------------------------------------------------------------------- */}

      <div className="mb-5">
        {leadingContent ?? (
          <div
            aria-hidden="true"
            className={[
              'flex',
              'size-11',
              'items-center',
              'justify-center',
              'rounded-full',
              'border',
              'border-[var(--brand)]/15',
              'bg-[var(--brand-soft)]',
              'text-sm',
              'font-semibold',
              'tracking-tight',
              'text-[var(--brand)]',
              'sm:size-12',
            ].join(' ')}
          >
            {formattedStep}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Step content                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <h3
          className={[
            'text-lg',
            'font-semibold',
            'leading-7',
            'tracking-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {title}
        </h3>

        {description ? (
          <p
            className={[
              'mt-2',
              'max-w-sm',
              'text-sm',
              'leading-6',
              'text-[var(--foreground-secondary)]',
              'sm:text-base',
              'sm:leading-7',
            ].join(' ')}
          >
            {description}
          </p>
        ) : null}

        {trailingContent ? (
          <div className="mt-5">
            {trailingContent}
          </div>
        ) : null}
      </div>
    </div>
  );
}