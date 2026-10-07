'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Sections
// -----------------------------------------------------------------------------
//
// Presentation/composition component for the authenticated owner's Journey
// Demand detail and edit/review surfaces.
//
// Architecture:
// - owns no server state;
// - performs no API requests;
// - performs no authorization checks;
// - does not determine ownership;
// - does not determine lifecycle state;
// - does not hide sections based on lifecycle state;
// - does not derive lifecycle capabilities;
// - does not call mutation hooks;
// - does not construct backend domain objects;
// - does not own section persistence;
// - controls only section layout, ordering, and accessibility.
//
// The owning route/container supplies each section's already-composed content.
//
// This keeps the component reusable for:
//
//     /my-demands/[publicId]
//     /my-demands/[publicId]/edit
//
// Edit and review are intentionally the same surface. Individual sections may
// therefore contain their own editor and save controls without this component
// needing to know how those controls work.
//
// IMPORTANT UX PRINCIPLE:
// The owner-facing Journey Demand surface should not hide lifecycle state or
// arbitrary sections because of frontend-derived capability checks.
//
// Lifecycle state is displayed by the appropriate Journey Demand presentation
// components. Lifecycle actions are composed separately by the management
// components.
//
// This component only determines:
//
//     "Which sections did the owner surface provide, and in what order?"
//
// It does not determine:
//
//     "Which sections are allowed to exist?"
//
// or:
//
//     "Which lifecycle state permits this section?"
//
// -----------------------------------------------------------------------------

// =============================================================================
// Section
// =============================================================================

export interface MyJourneyDemandSection {
  /**
   * Stable identifier used for React rendering and accessible heading linkage.
   *
   * Examples:
   * - corridor
   * - schedule
   * - capacity
   * - pricing
   */
  readonly id: string;

  /**
   * Accessible name for the section.
   *
   * The visible section content may provide its own heading, but this label
   * guarantees that the outer section still has an accessible name.
   */
  readonly label: string;

  /**
   * Already-composed section content supplied by the owning container.
   *
   * This may be:
   * - a read-only summary;
   * - an editor;
   * - an editor with its own independent save action;
   * - another authenticated owner-facing presentation.
   *
   * This component does not inspect or reinterpret the content.
   */
  readonly content: ReactNode;
}

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandSectionsProps {
  /**
   * Sections are supplied in the exact order in which they should appear.
   *
   * This component intentionally does not:
   * - sort sections;
   * - filter sections;
   * - hide sections;
   * - reinterpret section meaning;
   * - apply lifecycle rules.
   */
  readonly sections: readonly MyJourneyDemandSection[];

  /**
   * Optional layout classes supplied by the parent.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function MyJourneyDemandSections({
  sections,
  className,
}: MyJourneyDemandSectionsProps) {
  /**
   * There is nothing meaningful to render when the owner supplies no
   * sections.
   *
   * Returning null avoids producing an empty landmark in the document.
   */
  if (sections.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'min-w-0',
        'space-y-4',
        className,
      )}
      aria-label="Journey Demand sections"
    >
      {sections.map((section) => (
        <section
          key={section.id}
          className="min-w-0"
          aria-labelledby={`${section.id}-heading`}
        >
          {/*
           * The section content owns its visual presentation.
           *
           * This visually hidden heading exists only to provide an accessible
           * name for the semantic <section> element without forcing a second
           * visible heading into every editor or summary component.
           */}
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

