// -----------------------------------------------------------------------------
// sisiMove — Hero Copy
// -----------------------------------------------------------------------------
//
// Primary messaging for the public landing-page hero.
//
// Responsibilities:
// - Present the core SisiMove value proposition.
// - Establish traveller-first positioning.
// - Remain presentation-only.
//
// Design principles:
// - Strong typography hierarchy.
// - Short readable line lengths.
// - Calm spacing.
// - Responsive without excessive text scaling.
// - No decorative UI inside the copy component.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface HeroCopyProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

// -----------------------------------------------------------------------------
// Hero Copy
// -----------------------------------------------------------------------------

export function HeroCopy({
  eyebrow = 'GOING SOMEWHERE?',
  title = 'Find people travelling your way.',
  description = 'Discover travellers sharing journeys and people looking for one.',
}: HeroCopyProps) {
  return (
    <div
      className={[
        'mx-auto',
        'w-full',
        'max-w-3xl',
        'text-center',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Eyebrow                                                             */}
      {/* ------------------------------------------------------------------- */}

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

      {/* ------------------------------------------------------------------- */}
      {/* Title                                                               */}
      {/* ------------------------------------------------------------------- */}

      <h1
        id="hero-heading"
        className={[
          'mx-auto',
          'mt-4',
          'max-w-3xl',
          'text-4xl',
          'font-bold',
          'leading-[1.08]',
          'tracking-[-0.035em]',
          'text-[var(--foreground)]',
          'sm:text-5xl',
          'lg:text-6xl',
          'xl:text-[4.25rem]',
          'xl:leading-[1.04]',
        ].join(' ')}
      >
        {title}
      </h1>

      {/* ------------------------------------------------------------------- */}
      {/* Description                                                          */}
      {/* ------------------------------------------------------------------- */}

      <p
        className={[
          'mx-auto',
          'mt-5',
          'max-w-2xl',
          'text-base',
          'leading-7',
          'text-[var(--foreground-secondary)]',
          'sm:mt-6',
          'sm:text-lg',
          'sm:leading-8',
        ].join(' ')}
      >
        {description}
      </p>
    </div>
  );
}