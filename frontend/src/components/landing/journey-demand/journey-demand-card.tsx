// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Card
// -----------------------------------------------------------------------------
//
// Presentation card for a publicly discoverable Journey Demand.
//
// This component intentionally does not:
// - fetch Journey Demand data
// - access the Journey Demand API
// - perform matching logic
// - expose private requester information
// - expose internal lifecycle state
// - access Commercial or financial information
//
// The landing page should receive an intentionally reduced public Journey
// Demand representation and pass the required presentation values to this
// component.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

import { JourneyDemandCapacity } from './journey-demand-capacity';
import { JourneyDemandPrice } from './journey-demand-price';
import { JourneyDemandRoute } from './journey-demand-route';
import { JourneyDemandSchedule } from './journey-demand-schedule';

// -----------------------------------------------------------------------------
// Public Presentation Model
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandCardData {
  publicId: string;
  origin: string;
  destination: string;
  earliestDeparture: string;
  latestDeparture: string;
  timezone?: string | null;
  requestedSeats: number;
  preferredPricePerSeat?: number | null;
  maximumPricePerSeat?: number | null;
  currency?: string | null;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCardProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'title'
  > {
  demand: PublicJourneyDemandCardData;
  actionContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCard({
  demand,
  actionContent,
  className,
  ...props
}: JourneyDemandCardProps) {
  return (
    <article
      aria-labelledby={`journey-demand-${demand.publicId}`}
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm',
        'transition-shadow hover:shadow-md',
        className,
      )}
      {...props}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Looking for a journey
          </p>

          <h3
            id={`journey-demand-${demand.publicId}`}
            className="mt-2 text-lg font-semibold tracking-tight text-neutral-950"
          >
            {demand.origin} → {demand.destination}
          </h3>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Demand Details                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-6 space-y-5">
        <JourneyDemandRoute
          origin={demand.origin}
          destination={demand.destination}
        />

        <JourneyDemandSchedule
          earliestDeparture={demand.earliestDeparture}
          latestDeparture={demand.latestDeparture}
          timezone={demand.timezone}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <JourneyDemandCapacity
            requestedSeats={demand.requestedSeats}
          />

          <JourneyDemandPrice
            preferredPricePerSeat={
              demand.preferredPricePerSeat
            }
            maximumPricePerSeat={
              demand.maximumPricePerSeat
            }
            currency={demand.currency}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Action                                                              */}
      {/* ------------------------------------------------------------------- */}

      {actionContent ? (
        <div className="mt-6 border-t border-neutral-100 pt-5">
          {actionContent}
        </div>
      ) : null}
    </article>
  );
}