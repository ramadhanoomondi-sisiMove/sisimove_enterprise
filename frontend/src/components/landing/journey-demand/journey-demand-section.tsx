// -----------------------------------------------------------------------------
// sisiMove — Landing Journey Demand Section
// -----------------------------------------------------------------------------
//
// Presentation section for publicly discoverable Journey Demands.
//
// Responsibilities:
// - Present the landing-page Journey Demand section.
// - Explain the demand-side journey-sharing concept.
// - Render public Journey Demand cards.
// - Provide a truthful empty state.
// - Allow the parent discovery layer to control card actions.
//
// This component intentionally does not:
// - fetch Journey Demand data
// - perform search or matching
// - access authentication state
// - expose requester identity
// - expose matched-seat or lifecycle details
// - perform booking or joining actions
//
// Discovery/search belongs to the feature layer. This component only renders
// the public presentation supplied to it.
//
// The visual language treats Journey Demand as a first-class sisiMove
// capability rather than simply another list of cards.
//
// -----------------------------------------------------------------------------


import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../../foundation/utils/cn';

import {
  JourneyDemandCard,
  type PublicJourneyDemandCardData,
} from './journey-demand-card';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandSectionProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'title'
  > {
  /**
   * Public Journey Demands supplied by the discovery/read-model layer.
   */
  demands: PublicJourneyDemandCardData[];

  /**
   * Small section label.
   */
  eyebrow?: string;

  /**
   * Main section heading.
   */
  title?: string;

  /**
   * Supporting explanation of Journey Demand.
   */
  description?: string;

  /**
   * Empty-state heading shown when no public demands are available.
   */
  emptyTitle?: string;

  /**
   * Empty-state explanation shown when no public demands are available.
   */
  emptyDescription?: string;

  /**
   * Parent-controlled action rendered inside each demand card.
   */
  renderAction?: (
    demand: PublicJourneyDemandCardData,
  ) => ReactNode;

  /**
   * ID used to associate the section with its heading.
   */
  headingId?: string;
}


// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_EYEBROW =
  'JOURNEY DEMAND';

const DEFAULT_TITLE =
  'People are planning journeys too';

const DEFAULT_DESCRIPTION =
  'Not every journey starts with a driver posting a seat. Sometimes people know where they want to go first. sisiMove lets them share that plan so the right journey can find them.';

const DEFAULT_EMPTY_TITLE =
  'No travel plans shared yet';

const DEFAULT_EMPTY_DESCRIPTION =
  'Be among the first to share where you are hoping to travel. Your plan could help connect you with someone heading the same way.';

const DEFAULT_HEADING_ID =
  'journey-demand-heading';


// -----------------------------------------------------------------------------
// Demand Network Icon
// -----------------------------------------------------------------------------

function DemandNetworkIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="size-7"
    >
      <circle
        cx="10"
        cy="24"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="38"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="38"
        cy="36"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M14 22L34 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M14 26L34 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M24 18L28 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />

      <path
        d="M24 30L28 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}


// -----------------------------------------------------------------------------
// Planning Indicator
// -----------------------------------------------------------------------------

function PlanningIndicator({
  count,
}: {
  count: number;
}) {
  return (
    <div
      className={cn(
        'mt-8',
        'overflow-hidden',
        'rounded-2xl',
        'border',
        'border-[var(--brand)]/15',
        'bg-[var(--brand-soft)]',
      )}
    >
      <div
        className={cn(
          'flex',
          'flex-col',
          'gap-4',
          'px-5',
          'py-5',
          'sm:flex-row',
          'sm:items-center',
          'sm:justify-between',
          'sm:px-6',
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Network Icon                                                      */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'flex',
            'size-12',
            'shrink-0',
            'items-center',
            'justify-center',
            'rounded-xl',
            'bg-white',
            'text-[var(--brand)]',
            'shadow-sm',
            'ring-1',
            'ring-[var(--brand)]/10',
          )}
        >
          <DemandNetworkIcon />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Message                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm',
              'font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            {count === 1
              ? '1 person is planning a journey'
              : `${count} people are planning journeys`}
          </p>

          <p
            className={cn(
              'mt-1',
              'text-sm',
              'leading-6',
              'text-[var(--foreground-secondary)]',
            )}
          >
            Their plans are visible to people who may already
            be travelling that way.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Concept Badge                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'inline-flex',
            'shrink-0',
            'items-center',
            'gap-2',
            'self-start',
            'rounded-full',
            'bg-white',
            'px-3',
            'py-1.5',
            'text-xs',
            'font-semibold',
            'text-[var(--brand)]',
            'shadow-sm',
            'ring-1',
            'ring-[var(--brand)]/10',
            'sm:self-center',
          )}
        >
          <span
            className="size-1.5 rounded-full bg-[var(--brand)]"
            aria-hidden="true"
          />

          Demand meets supply
        </div>
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandSection({
  demands,
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  emptyTitle = DEFAULT_EMPTY_TITLE,
  emptyDescription = DEFAULT_EMPTY_DESCRIPTION,
  renderAction,
  headingId = DEFAULT_HEADING_ID,
  className,
  ...props
}: JourneyDemandSectionProps) {
  const normalizedDemands =
    demands.filter(
      (demand) => demand != null,
    );

  const demandCount =
    normalizedDemands.length;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'relative',
        'overflow-hidden',
        'py-14',
        'sm:py-20',
        className,
      )}
      {...props}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Background Visual                                                   */}
      {/* ------------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none',
          'absolute',
          'inset-x-0',
          'top-0',
          'h-72',
          'bg-[radial-gradient(circle_at_15%_20%,var(--brand-soft),transparent_42%),radial-gradient(circle_at_85%_10%,var(--brand-soft),transparent_35%)]',
        )}
      />

      <div className="page-container relative">
        {/* ----------------------------------------------------------------- */}
        {/* Section Header                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'flex',
            'flex-col',
            'gap-8',
            'lg:flex-row',
            'lg:items-end',
            'lg:justify-between',
          )}
        >
          <div className="max-w-3xl">
            {/* ------------------------------------------------------------- */}
            {/* Eyebrow                                                       */}
            {/* ------------------------------------------------------------- */}

            <div
              className={cn(
                'inline-flex',
                'items-center',
                'gap-2',
                'rounded-full',
                'border',
                'border-[var(--brand)]/15',
                'bg-white/80',
                'px-3',
                'py-1.5',
                'text-xs',
                'font-semibold',
                'tracking-[0.14em]',
                'text-[var(--brand)]',
                'shadow-sm',
                'backdrop-blur',
              )}
            >
              <span
                className={cn(
                  'size-1.5',
                  'rounded-full',
                  'bg-[var(--brand)]',
                )}
                aria-hidden="true"
              />

              {eyebrow}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Heading                                                        */}
            {/* ------------------------------------------------------------- */}

            <h2
              id={headingId}
              className={cn(
                'mt-5',
                'max-w-2xl',
                'text-3xl',
                'font-semibold',
                'tracking-tight',
                'text-[var(--foreground)]',
                'sm:text-4xl',
                'lg:text-[2.65rem]',
                'lg:leading-tight',
              )}
            >
              {title}
            </h2>

            {/* ------------------------------------------------------------- */}
            {/* Description                                                    */}
            {/* ------------------------------------------------------------- */}

            <p
              className={cn(
                'mt-4',
                'max-w-2xl',
                'text-base',
                'leading-7',
                'text-[var(--foreground-secondary)]',
                'sm:text-lg',
                'sm:leading-8',
              )}
            >
              {description}
            </p>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Demand Count                                                     */}
          {/* ----------------------------------------------------------------- */}

          {demandCount > 0 && (
            <div
              className={cn(
                'flex',
                'shrink-0',
                'items-center',
                'gap-3',
                'rounded-2xl',
                'border',
                'border-[var(--border)]',
                'bg-[var(--surface)]',
                'px-4',
                'py-3',
                'shadow-sm',
              )}
            >
              <span
                className={cn(
                  'flex',
                  'size-10',
                  'items-center',
                  'justify-center',
                  'rounded-xl',
                  'bg-[var(--brand-soft)]',
                  'text-sm',
                  'font-bold',
                  'text-[var(--brand)]',
                )}
              >
                {demandCount}
              </span>

              <div>
                <p
                  className={cn(
                    'text-sm',
                    'font-semibold',
                    'text-[var(--foreground)]',
                  )}
                >
                  {demandCount === 1
                    ? 'Journey demand'
                    : 'Journey demands'}
                </p>

                <p
                  className={cn(
                    'text-xs',
                    'text-[var(--foreground-muted)]',
                  )}
                >
                  Waiting to be matched
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Demand Network Message                                            */}
        {/* ----------------------------------------------------------------- */}

        {demandCount > 0 && (
          <PlanningIndicator
            count={demandCount}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Demand List / Empty State                                         */}
        {/* ----------------------------------------------------------------- */}

        {demandCount > 0 ? (
          <div
            className={cn(
              'mt-8',
              'grid',
              'gap-5',
              'md:grid-cols-2',
              'lg:mt-10',
              'lg:grid-cols-3',
            )}
            aria-label="Journey demands"
          >
            {normalizedDemands.map(
              (demand) => (
                <div
                  key={demand.publicId}
                  className="min-w-0"
                >
                  <JourneyDemandCard
                    demand={demand}
                    actionContent={
                      renderAction
                        ? renderAction(demand)
                        : undefined
                    }
                  />
                </div>
              ),
            )}
          </div>
        ) : (
          <div
            className={cn(
              'relative',
              'mt-10',
              'overflow-hidden',
              'rounded-3xl',
              'border',
              'border-dashed',
              'border-[var(--brand)]/20',
              'bg-[var(--brand-soft)]/50',
              'px-6',
              'py-12',
              'text-center',
              'sm:px-10',
              'sm:py-16',
            )}
            role="status"
          >
            {/* ------------------------------------------------------------- */}
            {/* Empty State Visual                                             */}
            {/* ------------------------------------------------------------- */}

            <div
              aria-hidden="true"
              className={cn(
                'mx-auto',
                'flex',
                'size-14',
                'items-center',
                'justify-center',
                'rounded-2xl',
                'bg-white',
                'text-[var(--brand)]',
                'shadow-sm',
                'ring-1',
                'ring-[var(--brand)]/10',
              )}
            >
              <DemandNetworkIcon />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Empty State Heading                                            */}
            {/* ------------------------------------------------------------- */}

            <h3
              className={cn(
                'mt-5',
                'text-lg',
                'font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              {emptyTitle}
            </h3>

            {/* ------------------------------------------------------------- */}
            {/* Empty State Description                                        */}
            {/* ------------------------------------------------------------- */}

            <p
              className={cn(
                'mx-auto',
                'mt-2',
                'max-w-lg',
                'text-sm',
                'leading-6',
                'text-[var(--foreground-secondary)]',
              )}
            >
              {emptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

