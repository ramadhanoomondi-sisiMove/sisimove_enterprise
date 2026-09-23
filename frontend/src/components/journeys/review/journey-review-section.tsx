// -----------------------------------------------------------------------------
// sisiMove — Journey Review Section
// -----------------------------------------------------------------------------
//
// Reusable presentation section for the final journey review.
//
// Responsibilities:
// - Render a labelled section of journey information.
// - Present already-resolved values supplied by the parent.
// - Optionally expose an edit action for the corresponding creation step.
//
// Non-responsibilities:
// - No API calls.
// - No data fetching.
// - No persistence.
// - No router usage.
// - No business-rule enforcement.
// - No mutation of journey state.
//
// The parent review component remains responsible for assembling the complete
// journey projection and deciding what each section contains.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface JourneyReviewSectionProps {
  /**
   * Section heading.
   */
  title: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Section content.
   */
  children: ReactNode;

  /**
   * Optional callback used to return to the corresponding creation step.
   */
  onEdit?: () => void;

  /**
   * Accessible label for the edit action.
   */
  editLabel?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyReviewSection({
  title,
  description,
  children,
  onEdit,
  editLabel = 'Edit',
}: JourneyReviewSectionProps) {
  // ---------------------------------------------------------------------------
  // The heading is the accessible label for the section.
  //
  // Keep the generated identifier in one place so aria-labelledby and the
  // heading id can never drift apart.
  // ---------------------------------------------------------------------------

  const headingId = `journey-review-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            id={headingId}
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            {title}
          </h3>

          {description ? (
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {description}
            </p>
          ) : null}
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-hover)]"
          >
            {editLabel}
          </button>
        ) : null}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}
