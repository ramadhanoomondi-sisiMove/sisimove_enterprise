// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Editor
// -----------------------------------------------------------------------------
//
// Controlled Journey Demand pricing editor.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Does not derive backend pricing flags.
// - Composes the lower-level price fields component.
// - Parent/container owns mutation, persistence, success/error handling,
//   authorization, and authoritative data refresh.
//
// The complete JourneyDemandPricing object is preserved when fields change,
// allowing backend-provided convenience flags and metadata to remain intact.
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandPricing } from '@/features/journey-demand/models';
import { Button } from '@/components/ui';
import { cn } from '@/foundation';

import { JourneyDemandPriceFields } from './journey-demand-price-fields';

export interface JourneyDemandPricingEditorProps {
  readonly pricing: JourneyDemandPricing;
  readonly onChange?: (pricing: JourneyDemandPricing) => void;
  readonly onSave?: () => void;
  readonly isSaving?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandPricingEditor({
  pricing,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandPricingEditorProps) {
  const controlsDisabled = disabled || isSaving;

  return (
    <section
      className={cn('surface', 'p-4 sm:p-5', className)}
      aria-labelledby="journey-demand-pricing-editor-heading"
    >
      <div className="min-w-0">
        <h2
          id="journey-demand-pricing-editor-heading"
          className="text-base font-semibold text-foreground"
        >
          Pricing
        </h2>

        <p className="mt-1 text-sm text-foreground-muted">
          Set the price conditions for this travel need.
        </p>
      </div>

      <div className="mt-5">
        <JourneyDemandPriceFields
          pricing={pricing}
          onChange={onChange}
          disabled={controlsDisabled}
        />
      </div>

      {onSave ? (
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onSave}
            loading={isSaving}
            disabled={disabled}
          >
            Save pricing
          </Button>
        </div>
      ) : null}
    </section>
  );
}

