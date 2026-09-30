// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences
// -----------------------------------------------------------------------------
//
// Presents the Journey's travel preferences.
//
// Product role:
//
//     Know before you book
//          │
//          ▼
//     Clear expectations
//          │
//          ▼
//     Booking confidence
//
// Responsibilities:
// - present smoking policy;
// - present pets policy;
// - present luggage policy;
// - present conversation preference;
// - present music preference.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no preference mutation;
// - no inference;
// - no policy transformation beyond presentation.
//
// The backend preference projection is authoritative. This component presents
// the supplied values without changing their meaning.
//
// -----------------------------------------------------------------------------

import {
  Check,
  SlidersHorizontal,
} from "lucide-react";

import { cn } from "@/foundation";

import type { JourneyPreferences as JourneyPreferencesModel } from "@/features/journey/models";

import { JourneyPreferencesSummary } from "../shared";

// =============================================================================
// Props
// =============================================================================

export interface JourneyPreferencesProps {
  readonly preferences: JourneyPreferencesModel;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyPreferences({
  preferences,
  className,
}: JourneyPreferencesProps) {
  return (
    <section
      className={cn(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
      aria-labelledby="journey-preferences-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          "px-5",
          "py-5",
          "sm:px-6",
          "sm:py-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "gap-2",
            "text-xs",
            "font-bold",
            "uppercase",
            "tracking-[0.14em]",
            "text-[var(--brand)]",
          )}
        >
          <SlidersHorizontal
            aria-hidden="true"
            className="size-3.5"
          />

          <span>Before you book</span>
        </div>

        <h2
          id="journey-preferences-heading"
          className={cn(
            "mt-1.5",
            "text-xl",
            "font-bold",
            "tracking-tight",
            "text-[var(--foreground)]",
            "sm:text-2xl",
          )}
        >
          Know what to expect.
        </h2>

        <p
          className={cn(
            "mt-1",
            "max-w-2xl",
            "text-sm",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          See the preferences set for passengers travelling on this Journey.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Preference presentation                                             */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-4 sm:p-5">
        <div
          className={cn(
            "overflow-hidden",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
          )}
        >
          {/* ----------------------------------------------------------------- */}
          {/* Intro rail                                                        */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "items-start",
              "gap-3",
              "border-b",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-4",
              "py-4",
              "sm:px-5",
            )}
          >
            <div
              aria-hidden="true"
              className={cn(
                "flex",
                "size-9",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-[var(--radius-md)]",
                "bg-[var(--brand-soft)]",
                "text-[var(--brand)]",
              )}
            >
              <SlidersHorizontal className="size-4" />
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm",
                  "font-bold",
                  "text-[var(--foreground)]",
                )}
              >
                Shared Journey expectations
              </p>

              <p
                className={cn(
                  "mt-0.5",
                  "text-xs",
                  "leading-5",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Review these preferences before choosing this Journey.
              </p>
            </div>

            <div
              className={cn(
                "ml-auto",
                "hidden",
                "shrink-0",
                "items-center",
                "gap-1.5",
                "rounded-full",
                "border",
                "border-[var(--border)]",
                "bg-[var(--background-subtle)]",
                "px-2.5",
                "py-1.5",
                "text-xs",
                "font-semibold",
                "text-[var(--foreground-muted)]",
                "sm:inline-flex",
              )}
            >
              <Check
                aria-hidden="true"
                className="size-3.5 text-[var(--success)]"
              />

              <span>Set by provider</span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Preference summary                                                 */}
          {/* ----------------------------------------------------------------- */}

          <div className="p-4 sm:p-5">
            <JourneyPreferencesSummary preferences={preferences} />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Supporting expectation message                                    */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "mt-3",
            "flex",
            "items-start",
            "gap-2.5",
            "px-1",
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "mt-0.5",
              "flex",
              "size-5",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-full",
              "bg-[var(--brand-soft)]",
              "text-[var(--brand)]",
            )}
          >
            <Check className="size-3" />
          </div>

          <p
            className={cn(
              "text-xs",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            Check these preferences alongside the route, timing, vehicle and
            available seats before booking.
          </p>
        </div>
      </div>
    </section>
  );
}

export default JourneyPreferences;