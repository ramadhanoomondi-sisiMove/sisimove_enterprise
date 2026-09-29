// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Fields
// -----------------------------------------------------------------------------
//
// Presentation-only fields for Journey travel preferences.
//
// Preferences are represented as controlled boolean values. This component
// does not apply business rules or determine which preferences are allowed.
// -----------------------------------------------------------------------------

import { Input } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Field Values
// -----------------------------------------------------------------------------

export interface JourneyPreferencesFieldValues {
  readonly smoking: boolean;
  readonly pets: boolean;
  readonly luggage: boolean;
  readonly conversation: boolean;
  readonly music: boolean;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPreferencesFieldsProps {
  readonly values: JourneyPreferencesFieldValues;

  readonly onChange: (
    field: keyof JourneyPreferencesFieldValues,
    value: boolean,
  ) => void;

  readonly disabled?: boolean;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPreferencesFields({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyPreferencesFieldsProps) {
  return (
    <div className={cn("grid", "gap-3", "sm:grid-cols-2", className)}>
      <label
        className={cn(
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "px-4",
          "py-3",
        )}
      >
        <span className="text-sm font-medium text-[var(--foreground)]">
          Smoking
        </span>

        <Input
          type="checkbox"
          checked={values.smoking}
          onChange={(event) => onChange("smoking", event.target.checked)}
          disabled={disabled}
          aria-label="Allow smoking"
        />
      </label>

      <label
        className={cn(
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "px-4",
          "py-3",
        )}
      >
        <span className="text-sm font-medium text-[var(--foreground)]">
          Pets
        </span>

        <Input
          type="checkbox"
          checked={values.pets}
          onChange={(event) => onChange("pets", event.target.checked)}
          disabled={disabled}
          aria-label="Allow pets"
        />
      </label>

      <label
        className={cn(
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "px-4",
          "py-3",
        )}
      >
        <span className="text-sm font-medium text-[var(--foreground)]">
          Luggage
        </span>

        <Input
          type="checkbox"
          checked={values.luggage}
          onChange={(event) => onChange("luggage", event.target.checked)}
          disabled={disabled}
          aria-label="Allow luggage"
        />
      </label>

      <label
        className={cn(
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "px-4",
          "py-3",
        )}
      >
        <span className="text-sm font-medium text-[var(--foreground)]">
          Conversation
        </span>

        <Input
          type="checkbox"
          checked={values.conversation}
          onChange={(event) =>
            onChange("conversation", event.target.checked)
          }
          disabled={disabled}
          aria-label="Allow conversation"
        />
      </label>

      <label
        className={cn(
          "flex",
          "items-center",
          "justify-between",
          "gap-4",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "px-4",
          "py-3",
        )}
      >
        <span className="text-sm font-medium text-[var(--foreground)]">
          Music
        </span>

        <Input
          type="checkbox"
          checked={values.music}
          onChange={(event) => onChange("music", event.target.checked)}
          disabled={disabled}
          aria-label="Allow music"
        />
      </label>
    </div>
  );
}