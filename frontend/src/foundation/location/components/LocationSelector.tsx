// -----------------------------------------------------------------------------
// Path: src/foundation/location/components/LocationSelector.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Foundation Location Selector
//
// Reusable SisiMove location selection component.
//
// Responsibilities:
// - present a location selection/search field;
// - display SisiMove-supported location suggestions;
// - allow the user to select a resolved location;
// - expose the selected location to the owning workflow;
// - allow an existing selection to be changed;
// - remain independent of Journey, Journey Demand, or any other domain.
//
// The component does NOT:
// - perform geocoding;
// - call an external location provider;
// - know where location data comes from;
// - fabricate coordinates;
// - own Journey state;
// - persist locations.
//
// Location/search behavior is supplied by the caller through props.
//
// -----------------------------------------------------------------------------

"use client";

import type { ChangeEvent } from "react";

import type { ResolvedLocation } from "../types/location.types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface LocationSelectorProps {
  readonly label: string;
  readonly placeholder?: string;

  /**
   * Currently selected SisiMove-supported location.
   */
  readonly value: ResolvedLocation | null;

  /**
   * Current presentation/search query.
   */
  readonly query: string;

  /**
   * Locations supplied by the owning workflow.
   */
  readonly suggestions: readonly ResolvedLocation[];

  readonly isSearching?: boolean;
  readonly disabled?: boolean;
  readonly error?: string | null;

  readonly onQueryChange: (query: string) => void;
  readonly onSelect: (location: ResolvedLocation) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LocationSelector({
  label,
  placeholder = "Select a location",
  value,
  query,
  suggestions,
  isSearching = false,
  disabled = false,
  error = null,
  onQueryChange,
  onSelect,
}: LocationSelectorProps) {
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onQueryChange(event.target.value);
  };

  const handleChangeLocation = (): void => {
    if (disabled) {
      return;
    }

    onQueryChange("");
  };

  return (
    <div className="space-y-2">
      {/* ---------------------------------------------------------------------
          Label
      --------------------------------------------------------------------- */}

      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* ---------------------------------------------------------------------
          Location input
      --------------------------------------------------------------------- */}

      <div className="relative">
        <input
          type="text"
          value={value?.name ?? query}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-label={label}
          aria-invalid={Boolean(error)}
          aria-autocomplete="list"
          onChange={handleQueryChange}
          className={[
            "w-full rounded-md border px-3 py-2 text-sm",
            "bg-background text-foreground",
            "outline-none transition",
            "placeholder:text-muted-foreground",
            "focus:ring-2 focus:ring-primary/20",
            error
              ? "border-destructive focus:border-destructive"
              : "border-border focus:border-primary",
            disabled ? "cursor-not-allowed opacity-60" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* -------------------------------------------------------------------
            Searching / filtering indicator
        ------------------------------------------------------------------- */}

        {isSearching && (
          <div
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
            aria-hidden="true"
          >
            <span className="text-xs text-muted-foreground">
              Searching…
            </span>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------
          Suggestions

          Suggestions are supplied by the owning workflow. This component
          does not determine whether a location is supported.

          Suggestions are hidden after a location has been selected.
      --------------------------------------------------------------------- */}

      {!value && suggestions.length > 0 && (
        <div
          className="overflow-hidden rounded-md border border-border bg-background shadow-sm"
          role="listbox"
          aria-label={`${label} suggestions`}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.key}
              type="button"
              disabled={disabled}
              role="option"
              aria-selected={false}
              onClick={() => onSelect(suggestion)}
              className={[
                "block w-full px-3 py-2 text-left",
                "text-sm text-foreground",
                "transition hover:bg-muted",
                "focus:bg-muted focus:outline-none",
                disabled ? "cursor-not-allowed opacity-60" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="block font-medium">
                {suggestion.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------------------------
          Resolved location
      --------------------------------------------------------------------- */}

      {value && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-foreground">
              {value.name}
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground">
              SisiMove-supported location
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleChangeLocation}
              className="shrink-0 text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Change
            </button>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------
          Error
      --------------------------------------------------------------------- */}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default LocationSelector;