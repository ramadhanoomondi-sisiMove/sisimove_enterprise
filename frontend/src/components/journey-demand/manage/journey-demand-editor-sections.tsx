// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/manage/journey-demand-editor-sections.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Editor Sections
//
// Composition-only renderer for the authenticated Journey Demand editing
// surface.
//
// Architecture
// ------------
//
// The owning JourneyDemandEditor decides:
//
// - which sections are present;
// - which section editors are composed;
// - which values are passed to each section;
// - which callbacks are connected;
// - which section is saving;
// - which section errors are displayed.
//
// This component only renders the sections it receives.
//
// Workflow:
//
//     JourneyDemandEditor
//          │
//          ├── corridor editor
//          ├── schedule editor
//          ├── capacity editor
//          └── pricing editor
//                    │
//                    ▼
//          JourneyDemandEditorSections
//                    │
//                    └── layout / semantic grouping
//
// This component does NOT:
//
// - fetch data;
// - call mutation hooks;
// - mutate data;
// - own drafts;
// - validate domain rules;
// - resolve supported corridors;
// - determine authorization;
// - determine lifecycle capability;
// - hide sections;
// - reorder sections;
// - create domain objects;
// - construct API requests;
// - navigate;
// - own success/error state.
//
// The section order is therefore authoritative at the call site. The renderer
// intentionally does not sort or filter the supplied collection.
//
// -----------------------------------------------------------------------------
//
// Important ownership rule
// ------------------------
//
// JourneyDemandEditor is the workflow owner.
//
// Individual section editors remain controlled presentation editors:
//
//     JourneyDemandEditor
//          │
//          ├── owns draft
//          ├── owns mutation
//          ├── owns refetch
//          └── owns success/error acknowledgement
//                    │
//                    ▼
//          JourneyDemandEditorSections
//                    │
//                    ├── JourneyDemandCorridorEditor
//                    ├── JourneyDemandScheduleEditor
//                    ├── JourneyDemandCapacityEditor
//                    └── JourneyDemandPricingEditor
//
// -----------------------------------------------------------------------------
//

'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation';

// =============================================================================
// Models
// =============================================================================

/**
 * A single already-composed section of the Journey Demand editing surface.
 *
 * `content` is intentionally a ReactNode rather than a component type.
 *
 * The owning JourneyDemandEditor therefore decides exactly how each section
 * is configured before handing it to this renderer.
 */
export interface JourneyDemandEditorSection {
  /**
   * Stable identity used by React and the semantic heading relationship.
   */
  readonly id: string;

  /**
   * Accessible name for the section.
   *
   * The visible editor normally supplies its own heading, while this label
   * provides a stable semantic heading for the outer section wrapper.
   */
  readonly label: string;

  /**
   * Already-composed section content.
   */
  readonly content: ReactNode;
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandEditorSectionsProps {
  /**
   * Sections in their intended presentation order.
   *
   * The renderer does not sort, filter, or otherwise transform this array.
   */
  readonly sections: readonly JourneyDemandEditorSection[];

  /**
   * Optional layout classes supplied by the owning editor.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Renders the sections supplied by JourneyDemandEditor.
 *
 * This is deliberately a very small component.
 *
 * Its purpose is to provide one canonical semantic/layout boundary around the
 * independently controlled Journey Demand section editors.
 */
export function JourneyDemandEditorSections({
  sections,
  className,
}: JourneyDemandEditorSectionsProps) {
  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  //
  // There is no empty-state UI here.
  //
  // An empty section collection simply means that the owning workflow has
  // nothing to render. The caller decides whether an empty editor should have
  // a separate presentation.
  //

  if (sections.length === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={cn(
        'min-w-0',
        'space-y-4',
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
          {/*
           * The visible section editor normally owns its own user-facing
           * heading. This visually-hidden heading gives the outer semantic
           * section a stable accessible name without introducing another
           * visible heading into the UI.
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