'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

/**
 * A section supplied to the owner's Journey Demand detail composition.
 *
 * The content is owned by the parent/container. This component only controls
 * layout and ordering.
 */
export interface MyJourneyDemandSection {
  readonly id: string;
  readonly label: string;
  readonly content: ReactNode;
}

/**
 * Props for the owner's Journey Demand sections.
 */
export interface MyJourneyDemandSectionsProps {
  readonly sections: readonly MyJourneyDemandSection[];
  readonly className?: string;
}

/**
 * Composes the authenticated owner's Journey Demand sections.
 *
 * This component deliberately does not:
 * - fetch Journey Demand data;
 * - determine ownership;
 * - perform authorization;
 * - derive lifecycle capabilities;
 * - call mutations;
 * - construct backend domain objects.
 *
 * The owning detail/container supplies the sections to render.
 */
export function MyJourneyDemandSections({
  sections,
  className,
}: MyJourneyDemandSectionsProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'min-w-0 space-y-4',
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

