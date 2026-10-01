// -----------------------------------------------------------------------------
// sisiMove — Journey Price Fields
// -----------------------------------------------------------------------------
//
// Presentation-only fields for editing Journey pricing.
//
// This component does NOT:
// - call the API;
// - validate pricing rules;
// - convert currencies;
// - calculate commissions or fees;
// - persist Journey pricing.
// -----------------------------------------------------------------------------

import { Input } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Field Values
// -----------------------------------------------------------------------------

export interface JourneyPriceFieldValues {
  readonly amount: string;
  readonly currency: string;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPriceFieldsProps {
  readonly values: JourneyPriceFieldValues;

  readonly onChange: (
    field: keyof JourneyPriceFieldValues,
    value: string,
  ) => void;

  readonly disabled?: boolean;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPriceFields({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyPriceFieldsProps) {
  return (
    <div
      className={cn(
        "grid",
        "gap-3",
        "sm:grid-cols-[minmax(0,1fr)_8rem]",
        className,
      )}
    >
      <Input
        label="Price"
        type="text"
        inputMode="decimal"
        value={values.amount}
        onChange={(event) => {
          onChange("amount", event.target.value);
        }}
        disabled={disabled}
        autoComplete="off"
        placeholder="e.g. 1250"
      />

      <Input
        label="Currency"
        value={values.currency}
        onChange={(event) => {
          onChange("currency", event.target.value);
        }}
        disabled={disabled}
        autoComplete="off"
        placeholder="KES"
      />
    </div>
  );
}