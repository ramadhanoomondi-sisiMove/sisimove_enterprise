// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Editor Sections
// -----------------------------------------------------------------------------
//
// Composition-only renderer for editable Journey Demand sections.
//
// Architecture:
// - Receives section content from the parent.
// - Does not fetch data.
// - Does not mutate data.
// - Does not determine authorization.
// - Does not determine which sections are editable.
// - Does not infer lifecycle capabilities.
// - Does not create domain objects.
//
// The owning editor/container decides which sections exist and supplies their
// already-composed content.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

// =============================================================================
// Models
// =============================================================================

/**
 * A single section rendered by the Journey Demand editor.
 *
 * Section content is supplied by the owning editor/container.
 */
export interface JourneyDemandEditorSection {
  readonly id: string;
  readonly label: string;
  readonly content: ReactNode;
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandEditorSectionsProps {
  readonly sections: readonly JourneyDemandEditorSection[];
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Renders the editable sections supplied by the parent.
 *
 * This component owns only layout and semantic section structure.
 */
export function JourneyDemandEditorSections({
  sections,
  className,
}: JourneyDemandEditorSectionsProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'min-w-0 space-y-4',
        className,
      )}
      aria-label="Journey Demand editor sections"
    >
      {sections.map((section) => (
        <section
          key={section.id}
          className="min-w-0"
          aria-labelledby={`${section.id}-heading`}
        >
          <h2
            id={`${section.id}-heading`}
            className="sr-only"
          >
            {section.label}
          </h2>

          {section.content}
        </section>
      ))}
    </div>
  );
}
