// src/components/landing/trust/trust-section-header.tsx

// -----------------------------------------------------------------------------
// sisiMove — Landing Trust Section Header
// -----------------------------------------------------------------------------
//
// Public landing-page Trust section header.
//
// Responsibilities:
// - Present the public Trust section heading.
// - Present the Trust section supporting message.
// - Provide the heading ID used by the parent section for accessibility.
// - Allow optional presentation customization.
//
// This component does not:
// - fetch Trust data;
// - access Trust APIs;
// - require authentication;
// - calculate Trust;
// - determine verification status;
// - access traveller information;
// - expose private Trust information.
//
// This is presentation-only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TrustSectionHeaderProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'title'
  > {
  /**
   * Small eyebrow displayed above the main heading.
   */
  eyebrow?: ReactNode;

  /**
   * Main Trust section heading.
   */
  title?: ReactNode;

  /**
   * Optional supporting description displayed below the heading.
   */
  description?: ReactNode;

  /**
   * Optional content rendered alongside the header on larger screens.
   */
  trailingContent?: ReactNode;

  /**
   * ID applied to the heading.
   *
   * The parent Trust section uses the same ID for its aria-labelledby
   * relationship.
   */
  headingId?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSectionHeader({
  eyebrow = 'TRAVEL WITH PEOPLE YOU CAN TRUST',
  title = 'Real people. Real journeys. Real trust signals.',
  description,
  trailingContent,
  headingId = 'trust-heading',
  className,
  ...props
}: TrustSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        'lg:flex-row lg:items-end lg:justify-between lg:gap-8',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            {eyebrow}
          </p>
        ) : null}

        <h2
          id={headingId}
          className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl"
        >
          {title}
        </h2>

        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {trailingContent ? (
        <div className="shrink-0 lg:pb-1">
          {trailingContent}
        </div>
      ) : null}
    </div>
  );
}