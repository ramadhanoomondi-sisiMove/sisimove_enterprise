'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Sections
// -----------------------------------------------------------------------------
//
// Presentation/composition component for the authenticated owner's Journey
// Demand detail view.
//
// Architecture:
// - owns no server state;
// - performs no API requests;
// - performs no authorization checks;
// - does not determine ownership;
// - does not derive lifecycle capabilities;
// - does not call mutation hooks;
// - does not construct backend domain objects;
// - controls only section layout and ordering.
//
// The owning detail/container supplies the sections and their content.
// -----------------------------------------------------------------------------

// =============================================================================
// Section
// =============================================================================

export interface MyJourneyDemandSection {
  /**
   * Stable identifier used for React rendering and heading linkage.
   */
  readonly id: string;

  /**
   * Accessible section label.
   */
  readonly label: string;

  /**
   * Already-composed section content supplied by the owner.
   */
  readonly content: ReactNode;
}

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandSectionsProps {
  readonly sections: readonly MyJourneyDemandSection[];
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function MyJourneyDemandSections({
  sections,
  className,
}: MyJourneyDemandSectionsProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('min-w-0 space-y-4', className)}
      aria-label="Journey Demand sections"
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
