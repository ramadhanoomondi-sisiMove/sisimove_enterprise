// -----------------------------------------------------------------------------
// sisiMove — Authenticated Marketplace Actions
// -----------------------------------------------------------------------------
//
// Authenticated participation entry point for the SisiMove marketplace.
//
// The authenticated Home presents two connected marketplace surfaces:
//
//     JOURNEYS
//     Available travel supply.
//
//     TRAVEL DEMAND
//     Expressed travel need.
//
// This component sits immediately above those surfaces and provides the
// authenticated member with the corresponding participation paths.
//
// Product relationship:
//
//     Publish a journey
//             │
//             ▼
//     Journey marketplace
//
//     Express travel demand
//             │
//             ▼
//     Travel demand marketplace
//
// The component is intentionally compact. The marketplace components below
// remain responsible for explaining and presenting the actual marketplace.
//
// This component is presentation-only.
//
// Responsibilities:
// - present authenticated marketplace participation actions;
// - provide the supplied navigation destinations;
// - visually connect supply and demand participation.
//
// Non-responsibilities:
// - no marketplace search;
// - no marketplace data fetching;
// - no matching;
// - no booking;
// - no notification delivery;
// - no authorization;
// - no Journey creation;
// - no Journey Demand creation;
// - no route construction;
// - no authentication-state management.
//
// -----------------------------------------------------------------------------


import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowRight,
  CarFront,
  UsersRound,
} from "lucide-react";

import { cn } from "@/foundation";

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedMarketplaceActionsProps {
  /**
   * Destination for the authenticated Journey creation flow.
   */
  readonly publishJourneyHref: string;

  /**
   * Destination for the authenticated Journey Demand creation flow.
   */
  readonly createDemandHref: string;

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
  readonly children: ReactNode;
  readonly variant: "primary" | "secondary";
}

function MarketplaceAction({
  href,
  children,
  variant,
}: MarketplaceActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group",
        "inline-flex",
        "min-h-10",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-[var(--radius-md)]",
        "px-3.5",
        "py-2",
        "text-sm",
        "font-semibold",
        "transition-all",
        "duration-150",
        "ease-out",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--brand)]",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--background-brand)]",

        // -------------------------------------------------------------------
        // Publish a Journey
        //
        // Brand-led without becoming a large blue block.
        // -------------------------------------------------------------------

        variant === "primary" && [
          "border",
          "border-[var(--brand)]",
          "bg-[var(--surface)]",
          "text-[var(--brand)]",
          "shadow-[var(--shadow-sm)]",
          "hover:bg-[var(--brand-soft)]",
          "hover:shadow-[var(--shadow-md)]",
        ].join(" "),

        // -------------------------------------------------------------------
        // Express Travel Demand
        // -------------------------------------------------------------------

        variant === "secondary" && [
          "border",
          "border-[var(--border-strong)]",
          "bg-[var(--background-subtle)]",
          "text-[var(--foreground)]",
          "shadow-[var(--shadow-sm)]",
          "hover:border-[var(--brand)]",
          "hover:bg-[var(--brand-soft)]",
          "hover:text-[var(--brand)]",
        ].join(" "),
      )}
    >
      {children}
    </Link>
  );
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedMarketplaceActions({
  publishJourneyHref,
  createDemandHref,
  className,
}: AuthenticatedMarketplaceActionsProps) {
  return (
    <section
      aria-labelledby="authenticated-marketplace-actions-heading"
      className={cn(
        "w-full",
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
          "max-w-7xl",
          "px-4",
          "py-4",
          "sm:px-6",
          "sm:py-5",
          "lg:px-8",
        )}
      >
        <div
          className={cn(
            "relative",
            "overflow-hidden",
            "rounded-[var(--radius-xl)]",
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
              "w-1",
              "bg-[var(--brand)]",
            )}
          />

          <div
            className={cn(
              "flex",
              "flex-col",
              "gap-4",
              "px-5",
              "py-4",
              "pl-6",
              "sm:px-6",
              "sm:py-5",
              "sm:pl-7",
              "lg:flex-row",
              "lg:items-center",
              "lg:justify-between",
              "lg:gap-8",
            )}
          >
            {/* ---------------------------------------------------------------
                Marketplace participation message
                --------------------------------------------------------------- */}

            <div className="min-w-0">
              <h2
                id="authenticated-marketplace-actions-heading"
                className={cn(
                  "text-base",
                  "font-bold",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  "sm:text-lg",
                )}
              >
                Be part of the journey marketplace.
              </h2>

              <p
                className={cn(
                  "mt-1",
                  "max-w-2xl",
                  "text-sm",
                  "leading-5",
                  "text-[var(--foreground-secondary)]",
                )}
              >
                Have available seats? Publish your journey. Can&apos;t find a
                suitable journey? Express where you want to travel.
              </p>

              {/* -------------------------------------------------------------
                  Supply / demand relationship
                  ------------------------------------------------------------- */}

              <div
                className={cn(
                  "mt-2.5",
                  "flex",
                  "flex-wrap",
                  "items-center",
                  "gap-x-3",
                  "gap-y-1",
                  "text-xs",
                  "font-medium",
                  "text-[var(--foreground-muted)]",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <CarFront
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[var(--brand)]"
                  />

                  <span>
                    Available journeys
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="text-[var(--border-strong)]"
                >
                  ↔
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <UsersRound
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[var(--brand)]"
                  />

                  <span>
                    Travel demand
                  </span>
                </span>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                Participation actions
                --------------------------------------------------------------- */}

            <div
              className={cn(
                "flex",
                "shrink-0",
                "flex-col",
                "gap-2",
                "sm:flex-row",
                "sm:items-center",
              )}
            >
              <MarketplaceAction
                href={publishJourneyHref}
                variant="primary"
              >
                <CarFront
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                <span>
                  Publish a journey
                </span>
              </MarketplaceAction>

              <MarketplaceAction
                href={createDemandHref}
                variant="secondary"
              >
                <UsersRound
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                <span>
                  Express travel demand
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    "h-4",
                    "w-4",
                    "transition-transform",
                    "duration-150",
                    "group-hover:translate-x-0.5",
                  )}
                />
              </MarketplaceAction>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthenticatedMarketplaceActions;