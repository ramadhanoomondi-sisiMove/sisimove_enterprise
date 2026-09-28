'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

/**
 * A single section rendered by the Journey Demand editor.
 *
 * The section content is supplied by the owning editor/container. This keeps
 * the composition layer independent from API contracts and mutation hooks.
 */
export interface JourneyDemandEditorSection {
  readonly id: string;
  readonly label: string;
  readonly content: ReactNode;
}

/**
 * Props for the Journey Demand editor sections container.
 */
export interface JourneyDemandEditorSectionsProps {
  readonly sections: readonly JourneyDemandEditorSection[];
  readonly className?: string;
}

/**
 * Composes the editable sections of a Journey Demand.
 *
 * This component deliberately does not:
 * - fetch Journey Demand data;
 * - mutate Journey Demand data;
 * - determine authorization;
 * - derive which sections are editable;
 * - create domain objects;
 * - decide lifecycle transitions.
 *
 * The parent editor owns those concerns and supplies the sections to render.
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
      className={cn('min-w-0 space-y-4', className)}
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

