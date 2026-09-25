// frontend/src/features/journey/components/journeys/creation/review/journey-review-step.tsx

import type { FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui';

// ============================================================
// JOURNEY REVIEW STEP
// ============================================================
//
// Presentation-only final review surface for Journey creation.
//
// The Journey already exists as a DRAFT when this step is reached.
//
// This component does not:
// - create the Journey;
// - attach Journey components;
// - publish the Journey;
// - perform navigation;
// - call APIs;
// - enforce Journey-domain invariants.
//
// The parent workflow supplies the review content and final
// submission handler.
//
// ============================================================

export interface JourneyReviewStepProps {
  /**
   * Review content supplied by the parent.
   */
  children?: ReactNode;

  /**
   * Prevents the final action from being submitted.
   */
  disabled?: boolean;

  /**
   * Indicates that the publish workflow is executing.
   */
  loading?: boolean;

  /**
   * Workflow error supplied by the parent.
   */
  error?: string;

  /**
   * Called when the user confirms publication.
   */
  onSubmit?: () => void | Promise<void>;

  className?: string;
}

export function JourneyReviewStep({
  children,
  disabled = false,
  loading = false,
  error,
  onSubmit,
  className,
}: JourneyReviewStepProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled || loading || !onSubmit) {
      return;
    }

    await onSubmit();
  };

  return (
    <form
      id="journey-review-form"
      noValidate
      onSubmit={handleSubmit}
      className={['space-y-6', className].filter(Boolean).join(' ')}
    >
      {/* --------------------------------------------------------
          Heading
          -------------------------------------------------------- */}

      <section aria-labelledby="journey-review-heading">
        <div className="mb-3">
          <h2
            id="journey-review-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Review your Journey
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Check your Journey details before making it available to
            travellers.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------
          Review content
          -------------------------------------------------------- */}

      {children}

      {/* --------------------------------------------------------
          Workflow error
          -------------------------------------------------------- */}

      {error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3"
        >
          <p className="text-sm leading-6 text-[var(--danger)]">
            {error}
          </p>
        </div>
      ) : null}

      {/* --------------------------------------------------------
          Final action
          -------------------------------------------------------- */}

      <div className="border-t border-[var(--border)] pt-5">
        <div className="w-full">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={disabled || loading || !onSubmit}
            loading={loading}
          >
            {loading ? 'Publishing Journey…' : 'Publish Journey'}
          </Button>
        </div>
      </div>
    </form>
  );
}