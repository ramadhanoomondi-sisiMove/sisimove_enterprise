// -----------------------------------------------------------------------------
// sisiMove — Journey Create Vehicle
// -----------------------------------------------------------------------------
//
// Presentation-only creation step for collecting Journey vehicle information.
//
// Responsibilities:
// - collect vehicle make/model;
// - collect optional year, color, and registration;
// - collect an optional opaque assetPublicId reference;
// - emit primitive string values through onChange;
// - render the existing UI primitives.
//
// The parent JourneyCreateForm owns:
// - vehicle field validation;
// - conversion of the year string to the command representation;
// - attachJourneyVehicle();
// - persistence errors;
// - navigation to the next creation step.
//
// Asset ownership remains outside the Journey feature. This component does not
// upload, replace, delete, or resolve an Asset. If the product later provides
// an Asset picker, the parent can supply the selected public ID here without
// changing the Journey vehicle command boundary.
//
// Registration is collected because it belongs to the authenticated Journey
// vehicle command. Public Journey projections must still respect the separate
// privacy boundary and must not expose registration before acceptance/payment.
// -----------------------------------------------------------------------------

import { Input } from "@/components/ui/input";
import { cn } from "@/foundation/utils/cn";

export interface JourneyCreateVehicleValues {
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly color: string;
  readonly registration: string;
  readonly assetPublicId: string;
}

export interface JourneyCreateVehicleProps {
  readonly values: JourneyCreateVehicleValues;
  readonly onChange: (
    field: keyof JourneyCreateVehicleValues,
    value: string,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyCreateVehicle({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyCreateVehicleProps) {
  return (
    <section
      aria-labelledby="journey-create-vehicle-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-vehicle-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          What vehicle are you travelling in?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Add the vehicle details passengers can use to identify the journey.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Make"
            value={values.make}
            onChange={(event) =>
              onChange("make", event.target.value)
            }
            placeholder="e.g. Toyota"
            disabled={disabled}
            autoComplete="off"
            fullWidth
          />

          <Input
            label="Model"
            value={values.model}
            onChange={(event) =>
              onChange("model", event.target.value)
            }
            placeholder="e.g. Noah"
            disabled={disabled}
            autoComplete="off"
            fullWidth
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Year"
            value={values.year}
            onChange={(event) =>
              onChange("year", event.target.value)
            }
            placeholder="e.g. 2022"
            inputMode="numeric"
            disabled={disabled}
            autoComplete="off"
            helperText="Optional"
            fullWidth
          />

          <Input
            label="Color"
            value={values.color}
            onChange={(event) =>
              onChange("color", event.target.value)
            }
            placeholder="e.g. White"
            disabled={disabled}
            autoComplete="off"
            helperText="Optional"
            fullWidth
          />
        </div>

        <Input
          label="Registration"
          value={values.registration}
          onChange={(event) =>
            onChange("registration", event.target.value)
          }
          placeholder="e.g. KDA 123A"
          disabled={disabled}
          autoComplete="off"
          helperText="Optional"
          fullWidth
        />

        <Input
          label="Vehicle photo asset"
          value={values.assetPublicId}
          onChange={(event) =>
            onChange("assetPublicId", event.target.value)
          }
          placeholder="Asset public ID"
          disabled={disabled}
          autoComplete="off"
          helperText="Optional. The selected Asset is managed by the Asset feature."
          fullWidth
        />
      </div>
    </section>
  );
}