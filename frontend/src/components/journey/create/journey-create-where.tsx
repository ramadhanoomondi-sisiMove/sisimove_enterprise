// -----------------------------------------------------------------------------
// sisiMove — Journey Create Where
// -----------------------------------------------------------------------------
//
// Presentation-only step for collecting the Journey corridor.
//
// Responsibilities:
// - collect origin and destination names;
// - collect optional origin/destination coordinates;
// - emit primitive string values through onChange;
// - render the existing UI primitives;
// - remain independent of API calls, domain objects, and persistence.
//
// The parent JourneyCreateForm owns:
// - coordinate parsing;
// - domain validation;
// - conversion of empty/invalid coordinates to undefined;
// - createJourney();
// - attachJourneyCorridor();
// - navigation to the next creation step.
//
// Coordinates intentionally remain strings here. In particular, do not use
// Number(value) in this component because Number("") evaluates to 0.
//
// Waypoints are intentionally not handled here. They are a separate Journey
// corridor concern and have their own editor/component layer.
// -----------------------------------------------------------------------------

import { Input } from "@/components/ui/input";
import { cn } from "@/foundation/utils/cn";

export interface JourneyCreateWhereValues {
  readonly originName: string;
  readonly originLatitude: string;
  readonly originLongitude: string;
  readonly destinationName: string;
  readonly destinationLatitude: string;
  readonly destinationLongitude: string;
}

export interface JourneyCreateWhereProps {
  readonly values: JourneyCreateWhereValues;
  readonly onChange: (
    field: keyof JourneyCreateWhereValues,
    value: string,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyCreateWhere({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyCreateWhereProps) {
  return (
    <section
      aria-labelledby="journey-create-where-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-where-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Where are you going?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Tell passengers where the journey starts and where it ends.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Origin
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              The starting point of the journey.
            </p>
          </div>

          <Input
            label="Origin"
            value={values.originName}
            onChange={(event) =>
              onChange("originName", event.target.value)
            }
            placeholder="e.g. Nairobi"
            disabled={disabled}
            autoComplete="off"
            fullWidth
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Latitude"
              value={values.originLatitude}
              onChange={(event) =>
                onChange("originLatitude", event.target.value)
              }
              placeholder="e.g. -1.286389"
              inputMode="decimal"
              disabled={disabled}
              autoComplete="off"
              helperText="Optional"
              fullWidth
            />

            <Input
              label="Longitude"
              value={values.originLongitude}
              onChange={(event) =>
                onChange("originLongitude", event.target.value)
              }
              placeholder="e.g. 36.817223"
              inputMode="decimal"
              disabled={disabled}
              autoComplete="off"
              helperText="Optional"
              fullWidth
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="h-px bg-[var(--border-subtle)]"
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Destination
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              The final destination of the journey.
            </p>
          </div>

          <Input
            label="Destination"
            value={values.destinationName}
            onChange={(event) =>
              onChange("destinationName", event.target.value)
            }
            placeholder="e.g. Mombasa"
            disabled={disabled}
            autoComplete="off"
            fullWidth
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Latitude"
              value={values.destinationLatitude}
              onChange={(event) =>
                onChange("destinationLatitude", event.target.value)
              }
              placeholder="e.g. -4.043477"
              inputMode="decimal"
              disabled={disabled}
              autoComplete="off"
              helperText="Optional"
              fullWidth
            />

            <Input
              label="Longitude"
              value={values.destinationLongitude}
              onChange={(event) =>
                onChange("destinationLongitude", event.target.value)
              }
              placeholder="e.g. 39.668207"
              inputMode="decimal"
              disabled={disabled}
              autoComplete="off"
              helperText="Optional"
              fullWidth
            />
          </div>
        </div>
      </div>
    </section>
  );
}