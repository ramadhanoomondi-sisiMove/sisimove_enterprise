// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing
// -----------------------------------------------------------------------------
//
// Detail presentation component for a public Journey Demand's price
// requirements.
//
// A Demand does not contain a confirmed Journey fare. The values shown here
// describe the requester's preferred and/or maximum acceptable price.
//
// Visual hierarchy:
//
//   PRICE REQUIREMENTS
//   Traveller's preferred / maximum price
//   Preferred price  |  Maximum price
//   Explicit pricing context
//
// Responsibilities:
// - present the preferred price when supplied;
// - present the maximum acceptable price when supplied;
// - preserve explicit absence of either value;
// - present the backend-provided currency;
// - clearly distinguish Demand pricing requirements from a confirmed fare.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no fare calculation;
// - no price comparison;
// - no booking amount;
// - no provider income;
// - no platform fee;
// - no commission;
// - no settlement or wallet information.
//
// The PublicJourneyDemandPricing projection remains authoritative.
// -----------------------------------------------------------------------------

import {
  Banknote,
  CircleDollarSign,
} from "lucide-react";

import type { PublicJourneyDemandPricing } from "@/features/journey-demand/models";

import { cn } from "@/foundation";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandPricingProps {
  /**
   * Public Journey Demand pricing projection.
   */
  readonly pricing: PublicJourneyDemandPricing;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function formatPrice(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandPricing({
  pricing,
  emphasis = "default",
  className,
}: JourneyDemandPricingProps) {
  const isCompact = emphasis === "compact";

  const hasPreferredPrice =
    pricing.preferredPricePerSeat !== null;

  const hasMaximumPrice =
    pricing.maximumPricePerSeat !== null;

  return (
    <section
      aria-labelledby="journey-demand-pricing-heading"
      className={cn(
        "min-w-0",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "min-w-0",
          "items-start",
          "gap-3",
          isCompact ? "mb-3" : "mb-4",
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
            "rounded-[var(--radius-lg)]",
            "bg-[var(--brand-soft)]",
            "text-[var(--brand)]",
          )}
        >
          <Banknote className="size-4" />
        </div>

        <div className="min-w-0">
          <p
            className={cn(
              "text-[0.65rem]",
              "font-bold",
              "uppercase",
              "tracking-[0.1em]",
              "text-[var(--brand)]",
            )}
          >
            Price requirements
          </p>

          <h2
            id="journey-demand-pricing-heading"
            className={cn(
              "mt-1",
              "font-bold",
              "tracking-tight",
              "text-[var(--foreground)]",
              isCompact ? "text-sm" : "text-base",
            )}
          >
            What the traveller is prepared to pay
          </h2>

          <p
            className={cn(
              "mt-1",
              "leading-5",
              "text-[var(--foreground-muted)]",
              isCompact ? "text-xs" : "text-sm",
            )}
          >
            These are Demand requirements, not a confirmed Journey fare.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Price requirements                                                  */}
      {/* ------------------------------------------------------------------- */}

      <dl
        className={cn(
          "grid",
          "min-w-0",
          "grid-cols-1",
          "gap-3",
          "sm:grid-cols-2",
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Preferred price                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "min-w-0",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--surface)]",
            isCompact ? "p-3" : "p-4",
          )}
        >
          <dt
            className={cn(
              "flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-medium",
              "text-[var(--foreground-muted)]",
            )}
          >
            <CircleDollarSign
              aria-hidden="true"
              className="size-3.5"
            />

            Preferred price / seat
          </dt>

          {hasPreferredPrice ? (
            <dd
              className={cn(
                "mt-2",
                "font-extrabold",
                "leading-none",
                "tracking-tight",
                "text-[var(--foreground)]",
                isCompact ? "text-lg" : "text-xl",
              )}
            >
              {formatPrice(
                pricing.preferredPricePerSeat,
                pricing.currency,
              )}
            </dd>
          ) : (
            <dd
              className={cn(
                "mt-2",
                "text-sm",
                "text-[var(--foreground-muted)]",
              )}
            >
              Not specified
            </dd>
          )}

          <p
            className={cn(
              "mt-2",
              "text-xs",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            The traveller&apos;s preferred amount for one seat.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Maximum price                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "min-w-0",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--surface)]",
            isCompact ? "p-3" : "p-4",
          )}
        >
          <dt
            className={cn(
              "flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-medium",
              "text-[var(--foreground-muted)]",
            )}
          >
            <CircleDollarSign
              aria-hidden="true"
              className="size-3.5"
            />

            Maximum price / seat
          </dt>

          {hasMaximumPrice ? (
            <dd
              className={cn(
                "mt-2",
                "font-extrabold",
                "leading-none",
                "tracking-tight",
                "text-[var(--foreground)]",
                isCompact ? "text-lg" : "text-xl",
              )}
            >
              {formatPrice(
                pricing.maximumPricePerSeat,
                pricing.currency,
              )}
            </dd>
          ) : (
            <dd
              className={cn(
                "mt-2",
                "text-sm",
                "text-[var(--foreground-muted)]",
              )}
            >
              No maximum specified
            </dd>
          )}

          <p
            className={cn(
              "mt-2",
              "text-xs",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            The highest amount specified for one seat.
          </p>
        </div>
      </dl>

      {/* ------------------------------------------------------------------- */}
      {/* Pricing context                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "mt-3",
          "flex",
          "items-start",
          "gap-2",
          "rounded-[var(--radius-lg)]",
          "border",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          isCompact ? "p-3" : "p-4",
        )}
      >
        <Banknote
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-[var(--foreground-muted)]"
        />

        <p
          className={cn(
            "text-xs",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          {pricing.currency} is the currency provided by the Demand
          projection. A final Journey fare, if a Journey is matched, is
          determined separately from this travel request.
        </p>
      </div>
    </section>
  );
}