// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Editor
// -----------------------------------------------------------------------------
//
// Controlled Journey Demand pricing editor.
//
// Architecture:
// - owns no server state;
// - performs no API requests;
// - performs no authorization checks;
// - does not derive backend pricing flags;
// - composes JourneyDemandPriceFields;
// - preserves the complete JourneyDemandPricing object;
// - does not construct backend domain objects;
// - does not own persistence or lifecycle decisions.
//
// The parent/container owns:
//
//     pricing draft
//          ↓
//     validation orchestration
//          ↓
//     updateJourneyDemandPricing(...)
//          ↓
//     refetch()
//          ↓
//     success/error feedback
//
// Pricing contract:
//
// - maximumPricePerSeat is the editable pricing value;
// - currency is supplied by the backend pricing model;
// - no preferred-price field is assumed;
// - backend-provided metadata is preserved;
// - saving pricing is independent from corridor, schedule, and capacity.
//
// This component is therefore suitable for the authenticated Edit / Review
// surface where each section is reviewed and saved independently.
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandPricing } from '@/features/journey-demand/models';
import { Button } from '@/components/ui';
import { cn } from '@/foundation';

import { JourneyDemandPriceFields } from './journey-demand-price-fields';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandPricingEditorProps {
  /**
   * Controlled Journey Demand pricing value.
   */
  readonly pricing: JourneyDemandPricing;

  /**
   * Emits the complete updated pricing object.
   *
   * Persistence remains the responsibility of the parent/container.
   */
  readonly onChange?: (pricing: JourneyDemandPricing) => void;

  /**
   * Optional independent save action for this section.
   */
  readonly onSave?: () => void | Promise<void>;

  /**
   * Indicates that pricing is currently being persisted.
   */
  readonly isSaving?: boolean;

  /**
   * External disabled state supplied by the parent.
   */
  readonly disabled?: boolean;

  readonly className?: string;
}


// =============================================================================
// Component
// =============================================================================

export function JourneyDemandPricingEditor({
  pricing,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandPricingEditorProps) {
  /**
   * Saving disables the editor so the draft cannot change while the parent
   * persists the current pricing state.
   *
   * This also prevents accidental duplicate submissions.
   */
  const controlsDisabled = disabled || isSaving;

  return (
    <section
      className={cn(
        'surface',
        'min-w-0',
        'p-4',
        'sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-pricing-editor-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <h2
          id="journey-demand-pricing-editor-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Pricing
        </h2>

        <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
          Set the maximum price you are willing to pay per seat.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Price fields                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 min-w-0">
        <JourneyDemandPriceFields
          pricing={pricing}
          onChange={onChange}
          disabled={controlsDisabled}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Save                                                                */}
      {/* ------------------------------------------------------------------- */}

      {onSave ? (
        <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              void onSave();
            }}
            loading={isSaving}
            disabled={controlsDisabled}
          >
            {isSaving ? 'Saving…' : 'Save pricing'}
          </Button>
        </div>
      ) : null}
    </section>
  );
}