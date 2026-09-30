// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing
// -----------------------------------------------------------------------------
//
// Presents the Journey's published price.
//
// Product role:
//
//     Clear cost
//          │
//          ▼
//     Understand the Journey
//          │
//          ▼
//     Decide whether to book
//
// Responsibilities:
// - present the amount;
// - present the currency.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no booking logic;
// - no fee calculation;
// - no currency conversion;
// - no payment logic;
// - no mutation.
//
// The pricing projection is authoritative. The frontend presents the supplied
// amount and currency without interpreting the amount as minor currency units.
//
// -----------------------------------------------------------------------------

import {
  Banknote,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/foundation";

import type { JourneyPricing as JourneyPricingModel } from "@/features/journey/models";

import { JourneyPrice } from "../shared";

// =============================================================================
// Props
// =============================================================================

export interface JourneyPricingProps {
  readonly pricing: JourneyPricingModel;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyPricing({
  pricing,
  className,
}: JourneyPricingProps) {
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
      aria-labelledby="journey-pricing-heading"
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
          <Banknote
            aria-hidden="true"
            className="size-3.5"
          />

          <span>Cost sharing</span>
        </div>

        <h2
          id="journey-pricing-heading"
          className={cn(
            "mt-1.5",
            "text-xl",
            "font-bold",
            "tracking-tight",
            "text-[var(--foreground)]",
            "sm:text-2xl",
          )}
        >
          Your seat on this Journey
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
          The published cost-sharing amount for a seat on this Journey.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Price                                                               */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-4 sm:p-5">
        <div
          className={cn(
            "relative",
            "overflow-hidden",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--brand)]/15",
            "bg-[var(--brand-soft)]",
            "p-5",
            "sm:p-6",
          )}
        >
          {/* Decorative visual cue */}

          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none",
              "absolute",
              "-right-8",
              "-top-8",
              "size-28",
              "rounded-full",
              "bg-[var(--brand)]/5",
            )}
          />

          <div
            className={cn(
              "relative",
              "flex",
              "flex-col",
              "gap-5",
              "sm:flex-row",
              "sm:items-center",
              "sm:justify-between",
            )}
          >
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className={cn(
                  "flex",
                  "size-12",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-full",
                  "bg-[var(--surface)]",
                  "text-[var(--brand)]",
                  "shadow-[var(--shadow-sm)]",
                )}
              >
                <Banknote className="size-6" />
              </div>

              <div>
                <p
                  className={cn(
                    "text-xs",
                    "font-semibold",
                    "uppercase",
                    "tracking-[0.1em]",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Seat price
                </p>

                <div className="mt-2">
                  <JourneyPrice pricing={pricing} />
                </div>
              </div>
            </div>

            <div
              className={cn(
                "flex",
                "items-center",
                "gap-2",
                "rounded-full",
                "border",
                "border-[var(--success)]/20",
                "bg-[var(--success-soft)]",
                "px-3",
                "py-2",
                "text-xs",
                "font-semibold",
                "text-[var(--success)]",
              )}
            >
              <CheckCircle2
                aria-hidden="true"
                className="size-3.5"
              />

              <span>Published price</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Clarification                                                     */}
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
          <Banknote
            aria-hidden="true"
            className={cn(
              "mt-0.5",
              "size-3.5",
              "shrink-0",
              "text-[var(--brand)]",
            )}
          />

          <p
            className={cn(
              "text-xs",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            This is the published cost-sharing amount for a seat on this
            Journey.
          </p>
        </div>
      </div>
    </section>
  );
}

export default JourneyPricing;