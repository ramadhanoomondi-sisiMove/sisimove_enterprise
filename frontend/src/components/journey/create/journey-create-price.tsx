// -----------------------------------------------------------------------------
// sisiMove — Journey Create Price
// -----------------------------------------------------------------------------
//
// Presentation-only creation step for collecting Journey pricing.
//
// Responsibilities:
// - collect the passenger cost-sharing amount;
// - collect the currency;
// - emit primitive string values through onChange;
// - render the existing Journey pricing fields.
//
// The parent JourneyCreateForm owns:
// - amount validation and numeric conversion;
// - currency validation;
// - attachJourneyPricing();
// - persistence errors;
// - navigation to the next creation step.
//
// Amount intentionally remains a string here. This prevents presentation
// concerns such as incomplete decimal input from being converted prematurely.
//
// The Journey pricing model is amount + currency. This component does not
// calculate totals, fees, commissions, or provider income.
// -----------------------------------------------------------------------------

import { Input } from "@/components/ui/input";
import { cn } from "@/foundation/utils/cn";

export interface JourneyCreatePriceValues {
  readonly amount: string;
  readonly currency: string;
}

export interface JourneyCreatePriceProps {
  readonly values: JourneyCreatePriceValues;
  readonly onChange: (
    field: keyof JourneyCreatePriceValues,
    value: string,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyCreatePrice({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyCreatePriceProps) {
  return (
    <section
      aria-labelledby="journey-create-price-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-price-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          What will passengers contribute?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Set the cost-sharing amount for one passenger seat.
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Amount per seat"
          value={values.amount}
          onChange={(event) =>
            onChange("amount", event.target.value)
          }
          placeholder="e.g. 1500"
          inputMode="decimal"
          disabled={disabled}
          autoComplete="off"
          helperText="Enter the amount passengers contribute for one seat."
          fullWidth
        />

        <Input
          label="Currency"
          value={values.currency}
          onChange={(event) =>
            onChange("currency", event.target.value)
          }
          placeholder="KES"
          disabled={disabled}
          autoComplete="off"
          fullWidth
        />
      </div>
    </section>
  );
}