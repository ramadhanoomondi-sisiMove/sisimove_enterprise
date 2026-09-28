// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Editor
// -----------------------------------------------------------------------------
//
// Authenticated/application Journey Demand editor composition.
//
// The editor consumes the generic JourneyDemand application/HTTP model.
//
// Architecture rules:
// - Composition/presentation only.
// - Receives an already-loaded JourneyDemand.
// - Does not fetch Journey Demand data.
// - Does not call mutation APIs.
// - Does not own mutation state.
// - Does not determine editing capabilities.
// - Does not infer lifecycle transitions.
// - Does not reconstruct backend aggregates or value objects.
// - Does not convert JourneyDemand into PublicJourneyDemand.
//
// The owning route/container supplies:
//
// - the loaded JourneyDemand;
// - editable section content;
// - persistence/mutation behaviour;
// - validation;
// - authorization;
// - lifecycle decisions.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { JourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandEditorHeader } from './journey-demand-editor-header';
import {
  JourneyDemandEditorSections,
  type JourneyDemandEditorSection,
} from './journey-demand-editor-sections';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandEditorProps {
  /**
   * Generic authenticated/application Journey Demand response.
   */
  readonly demand: JourneyDemand;

  /**
   * Editable content supplied by the owning editor/container.
   */
  readonly sections: readonly JourneyDemandEditorSection[];

  /**
   * Optional editor heading.
   */
  readonly title?: string;

  /**
   * Optional supporting description.
   */
  readonly description?: string;

  /**
   * Optional footer supplied by the owning container.
   *
   * This is typically where save/cancel controls are composed.
   */
  readonly footer?: ReactNode;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Composes the Journey Demand editing surface.
 *
 * This component deliberately does not:
 *
 * - fetch Journey Demand data;
 * - call mutation APIs;
 * - own mutation state;
 * - determine editing capabilities;
 * - infer lifecycle transitions;
 * - reconstruct backend aggregates or value objects.
 *
 * The owning route/container supplies the demand and editable section
 * components.
 */
export function JourneyDemandEditor({
  demand,
  sections,
  title,
  description,
  footer,
  className,
}: JourneyDemandEditorProps) {
  return (
    <div
      className={cn(
        'min-w-0',
        className,
      )}
    >
      <JourneyDemandEditorHeader
        demand={demand}
        title={title}
        description={description}
      />

      <div className="mt-5 min-w-0">
        <JourneyDemandEditorSections
          sections={sections}
        />
      </div>

      {footer ? (
        <div className="mt-5 min-w-0 border-t border-border pt-5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

