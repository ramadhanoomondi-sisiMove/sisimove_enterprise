// -----------------------------------------------------------------------------
// sisiMove — Landing Journey Demand Section
// -----------------------------------------------------------------------------
//
// Presentation section for publicly discoverable Journey Demands.
//
// Journey Demand has two presentation contexts:
//
//   1. General public discovery
//
//      Public Journey Demands are displayed as an independent marketplace
//      collection alongside published Journeys.
//
//   2. Empty Journey search conversion
//
//      When a traveller searches for a published Journey and no Journey is
//      available, the same search context becomes the starting point for
//      demand capture.
//
//      Example:
//
//        Nairobi → Kisumu
//        18 September 2026
//        ↓
//        No journey available yet
//        ↓
//        Create travel demand
//        ↓
//        Register / Login
//
// This component supports both contexts without owning discovery,
// authentication, routing, or conversion business logic.
//
// Responsibilities:
// - Present the landing-page Journey Demand section.
// - Explain the demand-side journey-sharing concept.
// - Render public Journey Demand cards.
// - Present a search-specific demand-capture state.
// - Preserve and display the supplied search context.
// - Allow the parent composition layer to control actions.
// - Remain independent of APIs, authentication, routing, and business rules.
//
// This component intentionally does not:
// - fetch Journey Demand data;
// - perform Journey Demand search;
// - perform matching;
// - create Journey Demands;
// - access authentication state;
// - expose requester identity;
// - expose matched-seat or lifecycle details;
// - perform booking or joining actions;
// - decide whether a demand should be created;
// - perform routing or navigation.
//
// Discovery/search belongs to the feature/composition layer.
//
// The parent supplies:
// - public demands;
// - optional empty-search context;
// - optional actions.
//
// The section only renders those decisions.
//
// Architectural boundary:
//
// Discovery composition
//        ↓
// JourneyDemandSection
//        ↓
// Presentation
//        ↓
// parent-controlled authentication action
//
// Empty Journey search:
//
// Journey search
//      ↓
// no published Journey
//      ↓
// discovery composition
//      ↓
// emptySearchContext
//      ↓
// JourneyDemandSection
//      ↓
// Create travel demand
//      ↓
// Register / Login
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
// Search Context
// -----------------------------------------------------------------------------
//
// Presentation-safe representation of the search that produced no published
// Journey.
//
// This is search intent, not a Journey Demand aggregate.
//
// The actual Journey Demand is only created later through the authenticated
// demand-creation flow.
// -----------------------------------------------------------------------------

export interface JourneyDemandSearchContext {
  readonly from: string;
  readonly to: string;
  readonly date: string;
}

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
   * Search context supplied when the Journey search returned no published
   * Journeys.
   *
   * When present, the section presents the search-specific demand opportunity.
   *
   * The section does not determine whether the search is empty. The discovery
   * composition layer owns that decision.
   */
  emptySearchContext?: JourneyDemandSearchContext | null;

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
   * Empty-state heading shown when no public demands are available and there
   * is no active empty Journey search.
   */
  emptyTitle?: string;

  /**
   * Empty-state explanation shown when no public demands are available and
   * there is no active empty Journey search.
   */
  emptyDescription?: string;

  /**
   * Parent-controlled action rendered inside each public demand card.
   */
  renderAction?: (
    demand: PublicJourneyDemandCardData,
  ) => ReactNode;

  /**
   * Parent-controlled action for continuing an empty Journey search into
   * authenticated Journey Demand creation.
   *
   * This is intentionally a ReactNode rather than a callback.
   *
   * The client composition layer may supply the CreateTravelDemandAction
   * component and connect it to the Register/Login flow while preserving the
   * supplied search context.
   *
   * This component does not know what happens when the action is activated.
   */
  createDemandAction?: ReactNode;

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

const DEFAULT_EMPTY_SEARCH_TITLE =
  'No journey available yet';

const DEFAULT_EMPTY_SEARCH_DESCRIPTION =
  'We could not find a published journey for this search. Turn the same route and date into a travel demand so people who can make the journey can see that you are looking to travel.';

const DEFAULT_HEADING_ID =
  'journey-demand-heading';

// -----------------------------------------------------------------------------
// Date Formatting
// -----------------------------------------------------------------------------
//
// The search date is supplied as a transport-safe value.
//
// Formatting belongs in the presentation layer. The section does not interpret
// the date for business rules; it only makes the supplied value readable.
// -----------------------------------------------------------------------------

function formatSearchDate(
  value: string,
): string {
  const parsedDate =
    new Date(`${value}T00:00:00`);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'en-KE',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(parsedDate);
}

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
//
// The number represents public Journey Demand records supplied to this
// component. It must not be presented as a count of unique people unless the
// read model explicitly provides that information.
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

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm',
              'font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            {count === 1
              ? '1 travel plan is waiting'
              : `${count} travel plans are waiting`}
          </p>

          <p
            className={cn(
              'mt-1',
              'text-sm',
              'leading-6',
              'text-[var(--foreground-secondary)]',
            )}
          >
            These plans are visible to people who may already
            be travelling that way.
          </p>
        </div>

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
// Empty Search Conversion
// -----------------------------------------------------------------------------
//
// This is intentionally different from the ordinary Journey Demand empty
// state.
//
// The traveller explicitly searched for a Journey. No published Journey was
// found. Their search therefore becomes useful demand-capture context.
//
// No Journey Demand is created here.
//
// The supplied action is responsible for taking the traveller into the
// authenticated Register/Login flow later.
// -----------------------------------------------------------------------------

function EmptySearchConversion({
  context,
  action,
  title,
  description,
}: {
  context: JourneyDemandSearchContext;
  action?: ReactNode;
  title: string;
  description: string;
}) {
  const formattedDate =
    formatSearchDate(context.date);

  return (
    <div
      className={cn(
        'relative',
        'mt-8',
        'overflow-hidden',
        'rounded-3xl',
        'border',
        'border-[var(--brand)]/20',
        'bg-[var(--brand-soft)]/60',
        'px-6',
        'py-9',
        'sm:px-10',
        'sm:py-10',
      )}
      role="status"
      aria-live="polite"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Visual                                                              */}
      {/* ------------------------------------------------------------------- */}

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

      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <h3
        className={cn(
          'mt-5',
          'text-center',
          'text-xl',
          'font-semibold',
          'tracking-tight',
          'text-[var(--foreground)]',
          'sm:text-2xl',
        )}
      >
        {title}
      </h3>

      {/* ------------------------------------------------------------------- */}
      {/* Search Context                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'mx-auto',
          'mt-5',
          'flex',
          'max-w-xl',
          'flex-col',
          'items-center',
          'justify-center',
          'gap-1',
          'text-center',
        )}
      >
        <div
          className={cn(
            'flex',
            'flex-wrap',
            'items-center',
            'justify-center',
            'gap-x-2',
            'gap-y-1',
            'text-base',
            'font-semibold',
            'text-[var(--foreground)]',
            'sm:text-lg',
          )}
        >
          <span>{context.from}</span>

          <span
            aria-hidden="true"
            className="text-[var(--brand)]"
          >
            →
          </span>

          <span>{context.to}</span>
        </div>

        <span
          className={cn(
            'text-sm',
            'font-medium',
            'text-[var(--foreground-secondary)]',
          )}
        >
          {formattedDate}
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Explanation                                                         */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={cn(
          'mx-auto',
          'mt-4',
          'max-w-lg',
          'text-center',
          'text-sm',
          'leading-6',
          'text-[var(--foreground-secondary)]',
          'sm:text-base',
          'sm:leading-7',
        )}
      >
        {description}
      </p>

      {/* ------------------------------------------------------------------- */}
      {/* Demand Capture                                                      */}
      {/* ------------------------------------------------------------------- */}

      {action && (
        <div
          className={cn(
            'mt-7',
            'flex',
            'justify-center',
          )}
        >
          {action}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// General Empty State
// -----------------------------------------------------------------------------

function GeneralEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className={cn(
        'relative',
        'mt-8',
        'overflow-hidden',
        'rounded-3xl',
        'border',
        'border-dashed',
        'border-[var(--brand)]/20',
        'bg-[var(--brand-soft)]/50',
        'px-6',
        'py-10',
        'text-center',
        'sm:px-10',
        'sm:py-12',
      )}
      role="status"
    >
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

      <h3
        className={cn(
          'mt-5',
          'text-lg',
          'font-semibold',
          'text-[var(--foreground)]',
        )}
      >
        {title}
      </h3>

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
        {description}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandSection({
  demands,
  emptySearchContext = null,
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  emptyTitle = DEFAULT_EMPTY_TITLE,
  emptyDescription = DEFAULT_EMPTY_DESCRIPTION,
  renderAction,
  createDemandAction,
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

  const isEmptySearch =
    emptySearchContext !== null;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'relative',
        'overflow-hidden',
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
          'h-64',
          'bg-[radial-gradient(circle_at_15%_20%,var(--brand-soft),transparent_42%),radial-gradient(circle_at_85%_10%,var(--brand-soft),transparent_35%)]',
        )}
      />

      {/*
       * The parent composition boundary owns the landing-page section
       * spacing, max-width, and horizontal gutters.
       *
       * This section therefore does not introduce another page container or
       * another outer padding layer.
       */}

      <div className="relative">
        {/* ----------------------------------------------------------------- */}
        {/* Section Header                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'flex',
            'flex-col',
            'gap-6',
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

          {demandCount > 0 &&
            !isEmptySearch && (
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
        {/* Empty Search → Demand Capture                                     */}
        {/* ----------------------------------------------------------------- */}

        {isEmptySearch ? (
          <EmptySearchConversion
            context={emptySearchContext}
            action={createDemandAction}
            title={DEFAULT_EMPTY_SEARCH_TITLE}
            description={
              DEFAULT_EMPTY_SEARCH_DESCRIPTION
            }
          />
        ) : (
          <>
            {/* ------------------------------------------------------------- */}
            {/* Demand Network Message                                        */}
            {/* ------------------------------------------------------------- */}

            {demandCount > 0 && (
              <PlanningIndicator
                count={demandCount}
              />
            )}

            {/* ------------------------------------------------------------- */}
            {/* Demand List / General Empty State                             */}
            {/* ------------------------------------------------------------- */}

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
              <GeneralEmptyState
                title={emptyTitle}
                description={emptyDescription}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

