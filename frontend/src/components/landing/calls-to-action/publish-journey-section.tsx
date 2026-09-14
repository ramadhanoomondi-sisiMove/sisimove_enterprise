// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Section
// -----------------------------------------------------------------------------
//
// Landing-page call-to-action for people who can provide a journey.
//
// The marketplace model is:
//
//     Existing travel opportunity
//              │
//              ▼
//        Publish Journey
//              │
//              ▼
//       Available seats
//              │
//              ▼
//            MARKET
//
// This component is presentation-only.
//
// It does not:
// - create or publish a Journey;
// - call an API;
// - access authentication state;
// - own permission logic.
//
// The action is exposed through an href so the application can handle the
// appropriate authenticated/unauthenticated flow.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PublishJourneySectionProps {
  /**
   * Destination used by the CTA.
   *
   * Defaults to the journey creation route.
   */
  href?: string;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PublishJourneySection({
  href = '/journeys/create',
  className,
}: PublishJourneySectionProps) {
  return (
    <section
      aria-labelledby="publish-journey-heading"
      className={[
        'px-6',
        'py-16',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* ----------------------------------------------------------------- */}
        {/* Eyebrow                                                          */}
        {/* ----------------------------------------------------------------- */}

        <p
          className={[
            'text-sm',
            'font-semibold',
            'uppercase',
            'tracking-[0.12em]',
            'text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          Can you make the journey?
        </p>

        {/* ----------------------------------------------------------------- */}
        {/* Heading                                                          */}
        {/* ----------------------------------------------------------------- */}

        <h2
          id="publish-journey-heading"
          className={[
            'mt-3',
            'text-2xl',
            'font-semibold',
            'tracking-tight',
            'text-[var(--foreground)]',
            'sm:text-3xl',
          ].join(' ')}
        >
          Turn your available seats into new travel.
        </h2>

        {/* ----------------------------------------------------------------- */}
        {/* Description                                                      */}
        {/* ----------------------------------------------------------------- */}

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
          See where people are already looking to travel. Publish a journey
          and make your available seats discoverable.
        </p>

        {/* ----------------------------------------------------------------- */}
        {/* Action                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-7">
          <Link
            href={href}
            className={[
              // Button base
              'inline-flex',
              'items-center',
              'justify-center',
              'gap-2',
              'font-medium',
              'whitespace-nowrap',
              'select-none',
              'transition-colors',
              'duration-150',
              'ease-out',

              // Button focus
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',

              // Button outline variant
              'bg-transparent',
              'text-[var(--foreground)]',
              'border',
              'border-[var(--border-strong)]',
              'hover:bg-[var(--background-subtle)]',
              'hover:border-[var(--foreground-subtle)]',
              'active:bg-[var(--background-muted)]',

              // Button lg size
              'min-h-12',
              'px-5',
              'text-base',
              'rounded-[var(--radius-lg)]',
            ].join(' ')}
          >
            Publish a journey
          </Link>
        </div>
      </div>
    </section>
  );
}