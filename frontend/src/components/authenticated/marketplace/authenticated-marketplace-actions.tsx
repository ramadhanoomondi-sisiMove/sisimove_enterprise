// -----------------------------------------------------------------------------
// sisiMove — Authenticated Marketplace Actions
// -----------------------------------------------------------------------------
//
// Secondary participation prompt for the authenticated marketplace.
//
// The SisiMove marketplaces themselves are the primary product surfaces:
//
//     JourneyMarketplace
//     JourneyDemandMarketplace
//
// This component provides additional authenticated entry points for members
// who want to participate in the marketplace by:
//
// - publishing available seats through a Journey;
// - creating a Journey Demand when they cannot find the Journey they need.
//
// This component is presentation-only.
//
// Responsibilities:
// - present authenticated marketplace participation actions;
// - navigate to the supplied Journey creation destination;
// - navigate to the supplied Journey Demand creation destination.
//
// Non-responsibilities:
// - no marketplace search;
// - no marketplace data fetching;
// - no matching;
// - no booking;
// - no joining a Journey Demand;
// - no notification delivery;
// - no authorization;
// - no Journey creation;
// - no Journey Demand creation;
// - no route construction;
// - no authentication-state management.
//
// Navigation destinations are supplied by the composition boundary so this
// component remains independent of application routing.
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
        "transition-colors",
        "duration-150",
        "ease-out",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--brand)]",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--background-brand)]",

        variant === "primary" && [
          "bg-[var(--brand)]",
          "text-[var(--brand-foreground)]",
          "hover:bg-[var(--brand-hover)]",
        ].join(" "),

        variant === "secondary" && [
          "border",
          "border-[var(--border-strong)]",
          "bg-[var(--surface)]",
          "text-[var(--foreground)]",
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
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div
          className={cn(
            "flex flex-col gap-4",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          {/* -----------------------------------------------------------------
              Message
              ----------------------------------------------------------------- */}

          <div className="min-w-0">
            <h2
              id="authenticated-marketplace-actions-heading"
              className={cn(
                "text-lg font-semibold tracking-tight",
                "text-[var(--foreground)]",
                "sm:text-xl",
              )}
            >
              What are you looking to do?
            </h2>

            <p
              className={cn(
                "mt-1 max-w-2xl",
                "text-sm leading-5",
                "text-[var(--foreground-secondary)]",
              )}
            >
              Have available seats? Publish your journey and make your trip
              discoverable. Can&apos;t find the journey you need? Create a
              travel demand so your travel need is visible to the marketplace.
            </p>
          </div>

          {/* -----------------------------------------------------------------
              Marketplace actions
              ----------------------------------------------------------------- */}

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <MarketplaceAction
              href={publishJourneyHref}
              variant="primary"
            >
              <CarFront
                aria-hidden="true"
                className="h-4 w-4"
              />

              <span>Publish a journey</span>
            </MarketplaceAction>

            <MarketplaceAction
              href={createDemandHref}
              variant="secondary"
            >
              <UsersRound
                aria-hidden="true"
                className="h-4 w-4"
              />

              <span>Create travel demand</span>

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </MarketplaceAction>
          </div>
        </div>
      </div>
    </section>
  );
}