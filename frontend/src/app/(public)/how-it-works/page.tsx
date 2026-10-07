// -----------------------------------------------------------------------------
// sisiMove — How It Works Page
// -----------------------------------------------------------------------------
//
// Public informational page.
//
// Product story:
// - sisiMove is a marketplace for planned long-distance journeys.
// - Members already travelling somewhere can make available seats discoverable.
// - Travellers looking for a journey can discover existing journeys.
// - A published journey contains the information travellers need to decide
//   whether it is suitable before booking.
// - The journey — not the vehicle, profile, or transaction — is the primary
//   unit of the marketplace.
// - Trust, identity, journey details and communication help people decide
//   whether a journey is suitable before travelling together.
//
// Core marketplace loop:
//
//   PLAN → PUBLISH → DISCOVER → BOOK → TRAVEL → COMPLETE
//
// Marketplace participants:
//
//   JOURNEY PROVIDER
//   └── already planning a long-distance journey
//       └── publishes available seats
//       └── receives bookings
//       └── travels the planned journey
//
//   TRAVELLER
//   └── needs to make a long-distance journey
//       └── discovers published journeys
//       └── reviews the journey and provider
//       └── books a suitable seat
//
// The page is intentionally presentation-only.
//
// Non-responsibilities:
// - authentication;
// - journey queries;
// - booking mutations;
// - journey creation;
// - trust decisions;
// - payment processing.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  CircleUserRound,
  Compass,
  Handshake,
  MapPin,
  MessageCircle,
  Route,
  Search,
  ShieldCheck,
  TicketCheck,
  Users,
} from "lucide-react";

import { Button, Card, Divider } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/foundation/routing";

// =============================================================================
// Page
// =============================================================================

export default function HowItWorksPage() {
  return (
    <main className="w-full min-w-0">
      {/* --------------------------------------------------------------------- */}
      {/* Hero                                                                  */}
      {/* --------------------------------------------------------------------- */}

      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--background-brand)]">
        <div className="page-container py-14 sm:py-18 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--brand)] shadow-[var(--shadow-sm)]">
                <Route
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
                The sisiMove journey marketplace
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Long-distance travel starts with a plan.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--foreground-secondary)] sm:text-lg sm:leading-8">
                sisiMove brings together people who are already planning a
                journey and people looking for a journey. Members can make
                available seats discoverable, while travellers can find a
                suitable journey going their way.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
                Instead of starting with a vehicle or a transaction, sisiMove
                starts with the journey itself — where, when, who is travelling
                and whether there is an available seat.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={PUBLIC_ROUTES.JOURNEYS}>
                  <Button>
                    <Search
                      aria-hidden="true"
                      className="mr-2 h-4 w-4"
                    />
                    Explore journeys
                  </Button>
                </Link>

                <Link href={PUBLIC_ROUTES.JOURNEYS}>
                  <Button variant="outline">
                    Publish a journey
                    <ArrowRight
                      aria-hidden="true"
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                </Link>
              </div>
            </div>

            {/* -----------------------------------------------------------------
                Marketplace visual
                ----------------------------------------------------------------- */}

            <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)] sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                      A journey becomes discoverable
                    </p>

                    <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                      Nairobi → Mombasa
                    </p>
                  </div>

                  <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]">
                    Available
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-[var(--background-subtle)] p-4">
                  <JourneyNode
                    icon={MapPin}
                    label="From"
                    value="Nairobi"
                    tone="brand"
                  />

                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 text-[var(--foreground-subtle)]"
                  />

                  <JourneyNode
                    icon={MapPin}
                    label="To"
                    value="Mombasa"
                    tone="danger"
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--border-subtle)] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                  <JourneyMetric
                    label="Date"
                    value="Sat, 12 Oct"
                  />

                  <JourneyMetric
                    label="Seats"
                    value="3 available"
                  />

                  <JourneyMetric
                    label="Price"
                    value="KES 1,250"
                  />
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-brand)] text-[var(--brand)]">
                    <CircleUserRound
                      aria-hidden="true"
                      className="h-4.5 w-4.5"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      @traveller
                    </p>

                    <p className="text-xs text-[var(--foreground-muted)]">
                      Verified · 18 completed journeys
                    </p>
                  </div>

                  <BadgeCheck
                    aria-hidden="true"
                    className="ml-auto h-5 w-5 shrink-0 text-[var(--success)]"
                  />
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-md)] sm:block">
                <div className="flex items-center gap-2">
                  <Handshake
                    aria-hidden="true"
                    className="h-4 w-4 text-[var(--brand)]"
                  />

                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    A planned journey becomes an opportunity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Problem / market                                                      */}
      {/* --------------------------------------------------------------------- */}

      <section className="border-b border-[var(--border-subtle)] bg-[var(--surface)]">
        <div className="page-container py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
                Why sisiMove exists
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                The road is already full of planned journeys.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                Every day, people plan long-distance journeys between cities,
                towns and communities. Some already have a vehicle and empty
                seats. Others need to travel but do not have a suitable journey
                arranged.
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                sisiMove creates a marketplace around the journeys that are
                already happening.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MarketReality
                icon={CarFront}
                eyebrow="ALREADY TRAVELLING"
                title="A planned journey can carry more people."
                description="A member may already be travelling a long distance with available seats. sisiMove makes that journey visible to people going the same way."
              />

              <MarketReality
                icon={Search}
                eyebrow="LOOKING TO TRAVEL"
                title="A traveller can find an existing journey."
                description="A traveller may already know where and when they need to travel. They can discover journeys that fit those plans."
              />

              <MarketReality
                icon={Route}
                eyebrow="CLEAR JOURNEY INFORMATION"
                title="The journey provides the context."
                description="Route, schedule, available seats, price, vehicle and relevant preferences help travellers understand what is being offered."
              />

              <MarketReality
                icon={Handshake}
                eyebrow="THE MARKETPLACE"
                title="The right journey can become a shared trip."
                description="When a published journey fits a traveller's plans, they can review the details, book a seat and prepare to travel together."
              />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Core marketplace loop                                                 */}
      {/* --------------------------------------------------------------------- */}

      <section
        id="how-it-works"
        className="border-b border-[var(--border-subtle)] bg-[var(--background)]"
      >
        <div className="page-container py-14 sm:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
              The marketplace loop
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Plan → Publish → Discover → Book → Travel
            </h2>

            <p className="mt-4 text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
              sisiMove is built around planned journeys. A journey provider
              publishes where they are going and the seats they can make
              available. Travellers discover journeys that fit their plans,
              book suitable seats and travel together.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            <HowItWorksStep
              number="01"
              icon={Compass}
              title="Plan"
              description="Someone already has a long-distance journey in mind."
            />

            <HowItWorksStep
              number="02"
              icon={Route}
              title="Publish"
              description="The journey, available seats and travel details become visible."
            />

            <HowItWorksStep
              number="03"
              icon={Search}
              title="Discover"
              description="Travellers explore published journeys going their way."
            />

            <HowItWorksStep
              number="04"
              icon={TicketCheck}
              title="Book"
              description="A traveller reviews a suitable journey and books an available seat."
            />

            <HowItWorksStep
              number="05"
              icon={CarFront}
              title="Travel"
              description="The provider and travellers coordinate, meet and make the journey together."
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Two sides of marketplace                                              */}
      {/* --------------------------------------------------------------------- */}

      <section className="bg-[var(--surface)]">
        <div className="page-container py-14 sm:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
              One marketplace. Two participants.
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Start with the journey you already have — or the journey you
              need.
            </h2>

            <p className="mt-4 text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
              sisiMove gives journey providers a simple way to make available
              seats discoverable and gives travellers a simple way to find and
              book journeys that fit their plans.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <MarketplacePath
              eyebrow="I AM ALREADY GOING"
              icon={CarFront}
              title="Publish a journey"
              description="You already know your route and are planning to make the trip. If you have available seats, make the journey discoverable."
              steps={[
                "Create the journey you already plan to make.",
                "Add the route, date, departure window and available seats.",
                "Set the journey price and relevant travel preferences.",
                "Publish the journey for travellers to discover.",
                "Review and manage bookings as they come in.",
                "Coordinate the trip and travel together.",
              ]}
              actionHref={PUBLIC_ROUTES.JOURNEYS}
              actionLabel="Explore journeys"
            />

            <MarketplacePath
              eyebrow="I NEED TO GO"
              icon={Search}
              title="Find a journey"
              description="You already know where you need to travel. Search published journeys, review what fits your plans and book an available seat."
              steps={[
                "Search for journeys matching your route and timing.",
                "Review the journey, available seats and price.",
                "Review the provider and relevant trust information.",
                "Check the vehicle and travel preferences.",
                "Book when the journey fits your plans.",
                "Coordinate the trip and travel together.",
              ]}
              actionHref={PUBLIC_ROUTES.JOURNEYS}
              actionLabel="Explore journeys"
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Journey marketplace                                                   */}
      {/* --------------------------------------------------------------------- */}

      <section className="border-y border-[var(--border-subtle)] bg-[var(--background-brand)]">
        <div className="page-container py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                <Route
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
                Published journey
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Every published journey gives travellers something real to
                choose.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                A sisiMove journey is more than a route between two places.
                It gives travellers enough context to understand when the
                journey is happening, how many seats are available, what it
                costs and who they may be travelling with.
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                The goal is simple: make planned long-distance journeys easier
                to discover and easier to evaluate before booking.
              </p>

              <div className="mt-7">
                <Link href={PUBLIC_ROUTES.JOURNEYS}>
                  <Button>
                    Explore journeys
                    <ArrowRight
                      aria-hidden="true"
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                    Published journey
                  </p>

                  <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
                    Nairobi → Kisumu
                  </p>
                </div>

                <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]">
                  Available
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-[var(--background-subtle)] p-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <JourneyNode
                    icon={MapPin}
                    label="From"
                    value="Nairobi"
                    tone="brand"
                  />

                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 text-[var(--foreground-subtle)]"
                  />

                  <JourneyNode
                    icon={MapPin}
                    label="To"
                    value="Kisumu"
                    tone="danger"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <JourneySignal
                  label="Date"
                  value="18 Oct"
                />

                <JourneySignal
                  label="Seats"
                  value="2 available"
                  emphasis
                />

                <JourneySignal
                  label="Price"
                  value="KES 1,200"
                />
              </div>

              <Divider className="my-5" />

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-brand)] text-[var(--brand)]">
                  <CircleUserRound
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Published by a verified member.
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    Review the journey and provider before booking.
                  </p>
                </div>

                <BadgeCheck
                  aria-hidden="true"
                  className="ml-auto h-5 w-5 shrink-0 text-[var(--success)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* What makes the journey the product                                    */}
      {/* --------------------------------------------------------------------- */}

      <section className="bg-[var(--surface)]">
        <div className="page-container py-14 sm:py-18">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
              The journey is the product
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              People need enough context to decide before they travel.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
              sisiMove makes the important parts of a planned journey
              discoverable before a traveller commits to it.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <JourneyInformation
              icon={Route}
              title="Route"
              description="See where the journey starts, where it ends and the relevant route information."
            />

            <JourneyInformation
              icon={Compass}
              title="Schedule"
              description="Understand the planned travel date, departure window and relevant timing."
            />

            <JourneyInformation
              icon={Users}
              title="Capacity"
              description="See available seats and understand how much space remains on the journey."
            />

            <JourneyInformation
              icon={TicketCheck}
              title="Price"
              description="Review the journey's seat price and commercial details before booking."
            />

            <JourneyInformation
              icon={CarFront}
              title="Vehicle"
              description="Understand the vehicle being used for the planned long-distance journey."
            />

            <JourneyInformation
              icon={MessageCircle}
              title="Preferences"
              description="Review relevant travel preferences that can affect whether the journey suits you."
            />

            <JourneyInformation
              icon={CircleUserRound}
              title="People"
              description="See the relevant public identity and traveller information available to the marketplace."
            />

            <JourneyInformation
              icon={ShieldCheck}
              title="Trust"
              description="Use verification, ratings and completed journey context as part of your decision."
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Trust                                                                  */}
      {/* --------------------------------------------------------------------- */}

      <section className="border-y border-[var(--border-subtle)] bg-[var(--background)]">
        <div className="page-container py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-brand)] text-[var(--brand)]">
                <ShieldCheck
                  aria-hidden="true"
                  className="h-5.5 w-5.5"
                />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
                Trust before travel
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                The marketplace helps people make informed choices.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                Travelling together requires more than matching two points on
                a map. sisiMove exposes relevant journey and member context so
                people can evaluate whether a published journey fits them.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TrustItem
                icon={CircleUserRound}
                title="Identity"
                description="See the relevant public identity information associated with the journey provider."
              />

              <TrustItem
                icon={BadgeCheck}
                title="Verification"
                description="Verification indicators provide additional context where verification has been completed."
              />

              <TrustItem
                icon={CheckCircle2}
                title="Experience"
                description="Ratings and completed journey information provide useful context about prior marketplace participation."
              />

              <TrustItem
                icon={ShieldCheck}
                title="Privacy"
                description="Personal information is shared progressively rather than exposing unnecessary contact details publicly."
              />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Journey lifecycle                                                      */}
      {/* --------------------------------------------------------------------- */}

      <section className="bg-[var(--surface)]">
        <div className="page-container py-14 sm:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
              From marketplace to real journey
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Discovery is only the beginning.
            </h2>

            <p className="mt-4 text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
              sisiMove is designed around the complete journey lifecycle,
              rather than stopping when a traveller finds a listing.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <Card padding="none">
              <div className="divide-y divide-[var(--border-subtle)]">
                <LifecycleStep
                  number="01"
                  icon={Search}
                  title="Discover"
                  description="Find a published journey matching your route and travel plans."
                />

                <LifecycleStep
                  number="02"
                  icon={Route}
                  title="Review"
                  description="Compare the route, schedule, seats, price, preferences, vehicle and available member information."
                />

                <LifecycleStep
                  number="03"
                  icon={TicketCheck}
                  title="Book"
                  description="A traveller requests and confirms a place on a suitable published journey."
                />

                <LifecycleStep
                  number="04"
                  icon={MessageCircle}
                  title="Coordinate"
                  description="The people involved use the journey relationship and communication tools to prepare for travel."
                />

                <LifecycleStep
                  number="05"
                  icon={Users}
                  title="Board & Travel"
                  description="Participants meet at the agreed point, board and make the planned long-distance journey together."
                />

                <LifecycleStep
                  number="06"
                  icon={CheckCircle2}
                  title="Complete"
                  description="The journey reaches completion and the marketplace records the completed travel experience."
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Member proposition                                                     */}
      {/* --------------------------------------------------------------------- */}

      <section className="border-t border-[var(--border-subtle)] bg-[var(--background-brand)]">
        <div className="page-container py-14 sm:py-18">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
                    The sisiMove idea
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    Turn planned journeys into shared opportunities.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
                    A member does not need to become a transport operator to
                    make an available seat useful. A traveller does not need to
                    arrange an entire trip alone. sisiMove creates the
                    marketplace layer around journeys people are already
                    planning.
                  </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-brand)] text-[var(--brand)]">
                  <Handshake
                    aria-hidden="true"
                    className="h-8 w-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Closing CTA                                                            */}
      {/* --------------------------------------------------------------------- */}

      <section className="border-t border-[var(--border-subtle)] bg-[var(--surface)]">
        <div className="page-container py-14 sm:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-brand)] text-[var(--brand)]">
              <Compass
                aria-hidden="true"
                className="h-6 w-6"
              />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Your next long-distance journey may already be taking shape.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-secondary)] sm:text-base">
              Explore journeys already being planned, discover available
              seats, and see how sisiMove helps people connect around the
              journeys they are already making.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={PUBLIC_ROUTES.JOURNEYS}>
                <Button>
                  Explore journeys
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-2 h-4 w-4"
                  />
                </Button>
              </Link>

              <Link href={PUBLIC_ROUTES.JOURNEYS}>
                <Button variant="outline">
                  Publish a journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// =============================================================================
// Local Presentation Components
// =============================================================================

interface JourneyNodeProps {
  readonly icon: typeof MapPin;
  readonly label: string;
  readonly value: string;
  readonly tone: "brand" | "danger";
}

function JourneyNode({
  icon: Icon,
  label,
  value,
  tone,
}: JourneyNodeProps) {
  const toneClass =
    tone === "brand"
      ? "text-[var(--brand)]"
      : "text-[var(--danger)]";

  return (
    <div className="min-w-0">
      <div className={`flex items-center gap-1.5 ${toneClass}`}>
        <Icon
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0"
        />

        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p
        className={`mt-1 truncate text-sm font-bold ${toneClass} sm:text-base`}
      >
        {value}
      </p>
    </div>
  );
}

interface JourneyMetricProps {
  readonly label: string;
  readonly value: string;
}

function JourneyMetric({
  label,
  value,
}: JourneyMetricProps) {
  return (
    <div className="min-w-0 px-3 py-3 text-center">
      <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-[var(--foreground)] sm:text-sm">
        {value}
      </p>
    </div>
  );
}

interface JourneySignalProps {
  readonly label: string;
  readonly value: string;
  readonly emphasis?: boolean;
}

function JourneySignal({
  label,
  value,
  emphasis = false,
}: JourneySignalProps) {
  return (
    <div
      className={
        emphasis
          ? "rounded-xl bg-[var(--brand-soft)] px-3 py-3"
          : "rounded-xl bg-[var(--background-subtle)] px-3 py-3"
      }
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </p>

      <p
        className={
          emphasis
            ? "mt-1 text-sm font-bold text-[var(--brand)]"
            : "mt-1 text-sm font-bold text-[var(--foreground)]"
        }
      >
        {value}
      </p>
    </div>
  );
}

interface MarketRealityProps {
  readonly icon: typeof CarFront;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

function MarketReality({
  icon: Icon,
  eyebrow,
  title,
  description,
}: MarketRealityProps) {
  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-brand)] text-[var(--brand)]">
          <Icon
            aria-hidden="true"
            className="h-5 w-5"
          />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--brand)]">
          {eyebrow}
        </p>

        <h3 className="mt-2 text-lg font-bold text-[var(--foreground)]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>
    </Card>
  );
}

interface HowItWorksStepProps {
  readonly number: string;
  readonly icon: typeof Compass;
  readonly title: string;
  readonly description: string;
}

function HowItWorksStep({
  number,
  icon: Icon,
  title,
  description,
}: HowItWorksStepProps) {
  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-brand)] text-[var(--brand)]">
            <Icon
              aria-hidden="true"
              className="h-5 w-5"
            />
          </div>

          <span className="text-xs font-bold tracking-wide text-[var(--brand)]">
            {number}
          </span>
        </div>

        <h3 className="mt-5 text-base font-bold text-[var(--foreground)] sm:text-lg">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>
    </Card>
  );
}

interface MarketplacePathProps {
  readonly eyebrow: string;
  readonly icon: typeof Compass;
  readonly title: string;
  readonly description: string;
  readonly steps: readonly string[];
  readonly actionHref: string;
  readonly actionLabel: string;
}

function MarketplacePath({
  eyebrow,
  icon: Icon,
  title,
  description,
  steps,
  actionHref,
  actionLabel,
}: MarketplacePathProps) {
  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-brand)] text-[var(--brand)]">
            <Icon
              aria-hidden="true"
              className="h-5.5 w-5.5"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--brand)]">
              {eyebrow}
            </p>

            <h3 className="mt-1 text-xl font-bold text-[var(--foreground)]">
              {title}
            </h3>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-[var(--foreground-secondary)]">
          {description}
        </p>

        <Divider className="my-6" />

        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)]">
                {index + 1}
              </span>

              <span className="text-sm leading-6 text-[var(--foreground-secondary)]">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-7">
          <Link href={actionHref}>
            <Button variant="outline">
              {actionLabel}

              <ArrowRight
                aria-hidden="true"
                className="ml-2 h-4 w-4"
              />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

interface JourneyInformationProps {
  readonly icon: typeof Route;
  readonly title: string;
  readonly description: string;
}

function JourneyInformation({
  icon: Icon,
  title,
  description,
}: JourneyInformationProps) {
  return (
    <Card className="h-full">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-brand)] text-[var(--brand)]">
        <Icon
          aria-hidden="true"
          className="h-4.5 w-4.5"
        />
      </div>

      <h3 className="mt-4 text-base font-bold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
        {description}
      </p>
    </Card>
  );
}

interface TrustItemProps {
  readonly icon: typeof ShieldCheck;
  readonly title: string;
  readonly description: string;
}

function TrustItem({
  icon: Icon,
  title,
  description,
}: TrustItemProps) {
  return (
    <Card className="h-full">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-brand)] text-[var(--brand)]">
        <Icon
          aria-hidden="true"
          className="h-4.5 w-4.5"
        />
      </div>

      <h3 className="mt-4 text-base font-bold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
        {description}
      </p>
    </Card>
  );
}

interface LifecycleStepProps {
  readonly number: string;
  readonly icon: typeof Search;
  readonly title: string;
  readonly description: string;
}

function LifecycleStep({
  number,
  icon: Icon,
  title,
  description,
}: LifecycleStepProps) {
  return (
    <div className="flex gap-4 px-5 py-5 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-brand)] text-[var(--brand)]">
        <Icon
          aria-hidden="true"
          className="h-4.5 w-4.5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--brand)]">
            {number}
          </span>

          <h3 className="text-sm font-bold text-[var(--foreground)] sm:text-base">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}

