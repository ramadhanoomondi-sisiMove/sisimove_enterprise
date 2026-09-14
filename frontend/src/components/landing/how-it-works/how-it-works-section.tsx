// -----------------------------------------------------------------------------
// sisiMove — How It Works Section
// -----------------------------------------------------------------------------
//
// Public landing-page explanation of how the sisiMove journey marketplace
// works.
//
// The section explains both marketplace paths:
//
//     EXISTING SUPPLY
//     Browse → Book → Travel
//
//     EXISTING NEED
//     Create Demand → Join → Provider Publishes → Travel
//
// This component is presentation-only.
//
// It does not:
// - fetch marketplace data;
// - create journeys;
// - create demands;
// - perform bookings;
// - perform authentication.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface HowItWorksSectionProps {
  /**
   * Destination for creating a Journey Demand.
   */
  createDemandHref?: string;

  /**
   * Destination for publishing a Journey.
   */
  publishJourneyHref?: string;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function HowItWorksSection({
  createDemandHref = "/demands/create",
  publishJourneyHref = "/journeys/create",
  className,
}: HowItWorksSectionProps) {
  return (
    <section
      className={[
        "border-t border-border px-6 py-16 sm:py-20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* ----------------------------------------------------------------- */}
        {/* Section heading                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            How it works
          </p>

          <h2
            id="how-it-works-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            See, match, travel.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Browse what is already available, find people travelling the same
            way, and turn shared travel plans into real journeys.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Primary marketplace flow                                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <HowItWorksStep
            number="01"
            title="See"
            description="Browse published journeys and travel demands already visible in the market."
          />

          <HowItWorksStep
            number="02"
            title="Match"
            description="Book an available seat or join a travel demand that matches where you want to go."
          />

          <HowItWorksStep
            number="03"
            title="Travel"
            description="Meet, board, and travel together once the journey is arranged."
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Two marketplace paths                                             */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Supply path --------------------------------------------------- */}

          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Already travelling?
            </p>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              Share the journey you are already making.
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Publish your journey, make your available seats discoverable, and
              let travellers going the same way book them.
            </p>

            <div className="mt-6">
              <Link
                href={publishJourneyHref}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Publish a journey
              </Link>
            </div>
          </div>

          {/* Demand path --------------------------------------------------- */}

          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Need a journey?
            </p>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              Make your travel need visible.
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Create a travel demand, let other travellers join the plan, and
              give potential providers a clear opportunity to make the
              journey.
            </p>

            <div className="mt-6">
              <Link
                href={createDemandHref}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Create travel demand
              </Link>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace loop                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 px-6 py-8 text-center sm:px-8">
          <p className="text-sm font-medium text-muted-foreground">
            When demand becomes visible, a provider can see the opportunity,
            publish a journey, and bring new supply back into the market.
          </p>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// How It Works Step
// -----------------------------------------------------------------------------

interface HowItWorksStepProps {
  number: string;
  title: string;
  description: string;
}

function HowItWorksStep({
  number,
  title,
  description,
}: HowItWorksStepProps) {
  return (
    <div className="text-center">
      <span className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">
        {number}
      </span>

      <h3 className="mt-2 text-lg font-semibold text-foreground">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}