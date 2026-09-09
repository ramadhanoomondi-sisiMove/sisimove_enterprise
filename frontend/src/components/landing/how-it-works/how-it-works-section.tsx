// -----------------------------------------------------------------------------
// sisiMove — How It Works Section
// -----------------------------------------------------------------------------
//
// Public presentation section explaining the core SisiMove journey.
//
// Responsibilities:
// - Present the "How SisiMove Works" section.
// - Render the section header.
// - Render the ordered journey steps.
// - Allow presentation content to be overridden by the caller.
//
// This component does NOT:
// - fetch data;
// - manage authentication;
// - create journeys;
// - create journey demands;
// - perform bookings;
// - contain domain/application logic.
//
// Layout note:
// - The landing page owns the global page container.
// - This component therefore does not introduce a second page-container
//   abstraction.
// - This component owns the semantic <ol>/<li> structure.
// - HowItWorksStep owns only the internal presentation of an individual step.
// - Styling uses the shared SisiMove design tokens.
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../../foundation/utils/cn';

import {
  HowItWorksStep,
  type HowItWorksStepProps,
} from './how-it-works-step';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface HowItWorksSectionStep
  extends Pick<
    HowItWorksStepProps,
    | 'step'
    | 'title'
    | 'description'
    | 'leadingContent'
    | 'trailingContent'
  > {
  /**
   * Stable identifier used as the React list key.
   */
  id: string;
}

export interface HowItWorksSectionProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'title' | 'content'
  > {
  /**
   * Optional custom section header.
   *
   * When supplied, the caller is responsible for rendering the heading.
   */
  headerContent?: ReactNode;

  /**
   * Section eyebrow.
   */
  eyebrow?: ReactNode;

  /**
   * Section heading.
   */
  title?: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Steps displayed in order.
   */
  steps?: readonly HowItWorksSectionStep[];

  /**
   * Optional content displayed below the steps.
   */
  bottomContent?: ReactNode;

  /**
   * Heading id used by the default section header.
   *
   * Custom header content should use the same id when it renders
   * the section heading.
   */
  headingId?: string;

  /**
   * Optional override for the section's main content area.
   *
   * When supplied, the default ordered step list is not rendered.
   */
  content?: ReactNode;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_EYEBROW = 'HOW SISIMOVE WORKS';

const DEFAULT_TITLE =
  'Travel together in three simple steps.';

const DEFAULT_HEADING_ID = 'how-it-works-heading';

const DEFAULT_STEPS: readonly HowItWorksSectionStep[] = [
  {
    id: 'find-people',
    step: '01',
    title: 'Find people going your way',
    description:
      'Search routes and discover travellers heading in the same direction.',
  },
  {
    id: 'get-to-know-them',
    step: '02',
    title: 'Get to know them & their journey',
    description:
      'See their profile, trust signals and journey before you decide to connect.',
  },
  {
    id: 'share-the-journey',
    step: '03',
    title: 'Share the journey',
    description:
      'Book, join or share a journey and travel together.',
  },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function HowItWorksSection({
  headerContent,
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  description,
  steps = DEFAULT_STEPS,
  bottomContent,
  headingId = DEFAULT_HEADING_ID,
  content,
  className,
  ...props
}: HowItWorksSectionProps) {
  const hasCustomHeader = headerContent !== undefined;

  return (
    <section
      id="how-it-works"
      aria-labelledby={
        hasCustomHeader
          ? undefined
          : headingId
      }
      aria-label={
        hasCustomHeader
          ? 'How SisiMove works'
          : undefined
      }
      className={cn(
        'w-full',
        className,
      )}
      {...props}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      {headerContent ?? (
        <div className="mx-auto w-full max-w-3xl text-center">
          {eyebrow ? (
            <p
              className={[
                'text-[11px]',
                'font-bold',
                'uppercase',
                'tracking-[0.18em]',
                'text-[var(--brand)]',
              ].join(' ')}
            >
              {eyebrow}
            </p>
          ) : null}

          <h2
            id={headingId}
            className={[
              'mt-3',
              'text-3xl',
              'font-bold',
              'leading-tight',
              'tracking-tight',
              'text-[var(--foreground)]',
              'sm:text-4xl',
            ].join(' ')}
          >
            {title}
          </h2>

          {description ? (
            <p
              className={[
                'mx-auto',
                'mt-4',
                'max-w-2xl',
                'text-base',
                'leading-7',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              {description}
            </p>
          ) : null}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Main content                                                        */}
      {/* ------------------------------------------------------------------- */}

      {content ?? (
        steps.length > 0 ? (
          <ol
            aria-label="How SisiMove works"
            className={[
              'mx-auto',
              'mt-12',
              'grid',
              'w-full',
              'max-w-6xl',
              'gap-10',
              'md:grid-cols-3',
              'md:gap-8',
              'lg:gap-12',
            ].join(' ')}
          >
            {steps.map((item, index) => (
              <li
                key={item.id}
                className="relative min-w-0"
              >
                <HowItWorksStep
                  step={item.step}
                  title={item.title}
                  description={item.description}
                  leadingContent={item.leadingContent}
                  trailingContent={item.trailingContent}
                />

                {/* --------------------------------------------------------- */}
                {/* Desktop connector                                        */}
                {/* --------------------------------------------------------- */}

                {index < steps.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className={[
                      'pointer-events-none',
                      'absolute',
                      'left-[calc(100%+1rem)]',
                      'top-6',
                      'hidden',
                      'h-px',
                      'w-4',
                      'bg-[var(--border)]',
                      'lg:block',
                    ].join(' ')}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        ) : null
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Bottom content                                                      */}
      {/* ------------------------------------------------------------------- */}

      {bottomContent ? (
        <div className="mt-10 flex justify-center">
          {bottomContent}
        </div>
      ) : null}
    </section>
  );
}