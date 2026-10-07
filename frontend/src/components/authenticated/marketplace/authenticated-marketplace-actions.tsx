'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Marketplace Actions
// -----------------------------------------------------------------------------
//
// Responsive authenticated supply entry point for the SisiMove marketplace.
//
// Presentation-only.
// No business logic, authorization, fetching, route construction, or mutation.
// -----------------------------------------------------------------------------

import Link from "next/link";

import {
  ArrowRight,
  CarFront,
} from "lucide-react";

import { cn } from "@/foundation";

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedMarketplaceActionsProps {
  /**
   * Destination for the authenticated Journey creation flow.
   *
   * The route is supplied by the composition boundary.
   */
  readonly publishJourneyHref: string;

  /**
   * Optional additional classes supplied by the composition boundary.
   */
  readonly className?: string;
}

// =============================================================================
// Action
// =============================================================================

interface MarketplaceActionProps {
  readonly href: string;
}

function MarketplaceAction({
  href,
}: MarketplaceActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Layout
        "group",
        "inline-flex",
        "min-w-0",
        "max-w-full",
        "items-center",
        "justify-center",
        "gap-[clamp(0.35rem,0.7vw,0.5rem)]",

        // Sizing
        "min-h-[clamp(2.25rem,5vw,2.5rem)]",
        "rounded-[clamp(0.45rem,0.8vw,0.65rem)]",
        "px-[clamp(0.7rem,1.5vw,0.9rem)]",
        "py-[clamp(0.45rem,0.8vw,0.55rem)]",

        // Typography
        "text-[clamp(0.72rem,1.2vw,0.875rem)]",
        "font-semibold",
        "leading-tight",
        "text-[var(--brand)]",

        // Visual
        "border",
        "border-[var(--brand)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",

        // Interaction
        "transition-all",
        "duration-150",
        "ease-out",
        "hover:bg-[var(--brand-soft)]",
        "hover:shadow-[var(--shadow-md)]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--brand)]",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--background-brand)]",
      )}
    >
      <CarFront
        aria-hidden="true"
        className="size-[clamp(0.85rem,1.4vw,1rem)] shrink-0"
      />

      <span className="min-w-0 truncate">
        Publish a journey
      </span>

      <ArrowRight
        aria-hidden="true"
        className={cn(
          "size-[clamp(0.85rem,1.4vw,1rem)]",
          "shrink-0",
          "transition-transform",
          "duration-150",
          "group-hover:translate-x-0.5",
        )}
      />
    </Link>
  );
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedMarketplaceActions({
  publishJourneyHref,
  className,
}: AuthenticatedMarketplaceActionsProps) {
  return (
    <section
      aria-labelledby="authenticated-marketplace-actions-heading"
      className={cn(
        "w-full",
        "min-w-0",
        "overflow-x-hidden",
        "border-b",
        "border-[var(--border-subtle)]",
        "bg-[var(--background-brand)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto",
          "w-full",
          "min-w-0",
          "max-w-7xl",
          "px-[clamp(0.75rem,3vw,2rem)]",
          "py-[clamp(0.75rem,2vw,1.25rem)]",
        )}
      >
        <div
          className={cn(
            "relative",
            "w-full",
            "min-w-0",
            "max-w-full",
            "overflow-hidden",
            "rounded-[clamp(0.65rem,1.5vw,1rem)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--surface)]",
            "shadow-[var(--shadow-sm)]",
          )}
        >
          {/* -----------------------------------------------------------------
              SisiMove brand rail
              ----------------------------------------------------------------- */}

          <div
            aria-hidden="true"
            className={cn(
              "absolute",
              "inset-y-0",
              "left-0",
              "w-[clamp(0.18rem,0.35vw,0.25rem)]",
              "bg-[var(--brand)]",
            )}
          />

          <div
            className={cn(
              "flex",
              "min-w-0",
              "flex-col",

              // Fluid spacing
              "gap-[clamp(0.7rem,2vw,1rem)]",
              "px-[clamp(0.8rem,2.5vw,1.5rem)]",
              "py-[clamp(0.75rem,2vw,1.25rem)]",
              "pl-[clamp(1rem,3vw,1.75rem)]",

              // Desktop arrangement
              "lg:flex-row",
              "lg:items-center",
              "lg:justify-between",
              "lg:gap-[clamp(1rem,3vw,2rem)]",
            )}
          >
            {/* ---------------------------------------------------------------
                Marketplace participation message
                --------------------------------------------------------------- */}

            <div className="min-w-0 flex-1">
              <h2
                id="authenticated-marketplace-actions-heading"
                className={cn(
                  "min-w-0",
                  "text-[clamp(0.9rem,1.8vw,1.125rem)]",
                  "font-bold",
                  "leading-tight",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                )}
              >
                Have available seats?
              </h2>

              <p
                className={cn(
                  "mt-[clamp(0.2rem,0.5vw,0.35rem)]",
                  "max-w-2xl",
                  "text-[clamp(0.65rem,1.1vw,0.875rem)]",
                  "leading-relaxed",
                  "text-[var(--foreground-secondary)]",
                )}
              >
                Publish your journey and let travellers discover your
                available seats.
              </p>

              {/* -------------------------------------------------------------
                  Supply context
                  ------------------------------------------------------------- */}

              <div
                className={cn(
                  "mt-[clamp(0.4rem,0.8vw,0.65rem)]",
                  "flex",
                  "min-w-0",
                  "items-center",
                  "text-[clamp(0.58rem,0.9vw,0.75rem)]",
                  "font-medium",
                  "leading-tight",
                  "text-[var(--foreground-muted)]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex",
                    "min-w-0",
                    "max-w-full",
                    "items-center",
                    "gap-[clamp(0.3rem,0.6vw,0.4rem)]",
                  )}
                >
                  <CarFront
                    aria-hidden="true"
                    className="size-[clamp(0.75rem,1.2vw,0.875rem)] shrink-0 text-[var(--brand)]"
                  />

                  <span className="min-w-0 truncate">
                    Publish available seats
                  </span>
                </span>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                Publish Journey action
                --------------------------------------------------------------- */}

            <div
              className={cn(
                "flex",
                "min-w-0",
                "max-w-full",
                "shrink-0",
                "lg:items-center",
              )}
            >
              <MarketplaceAction href={publishJourneyHref} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthenticatedMarketplaceActions;