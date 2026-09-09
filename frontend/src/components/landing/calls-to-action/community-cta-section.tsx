// -----------------------------------------------------------------------------
// sisiMove — Community CTA Section
// -----------------------------------------------------------------------------
//
// Final broad call to action for joining the sisiMove community.
//
// Responsibilities:
// - Present the community proposition.
// - Render supplied action content.
// - Render supplied secondary content.
// - Provide a stable section and heading relationship.
//
// This component does NOT:
// - perform registration;
// - manage authentication;
// - perform routing;
// - fetch community data;
// - contain business logic.
//
// Navigation and actions are supplied by the parent through ReactNode props.
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommunityCtaSectionProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'title' | 'content'
  > {
  /**
   * Section eyebrow.
   */
  eyebrow?: ReactNode;

  /**
   * Section heading.
   */
  title?: ReactNode;

  /**
   * Supporting description.
   */
  description?: ReactNode;

  /**
   * Primary action content.
   */
  actionContent?: ReactNode;

  /**
   * Secondary action or supporting content.
   */
  secondaryContent?: ReactNode;

  /**
   * ID of the section heading.
   */
  headingId?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_HEADING_ID = 'community-cta-heading';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommunityCtaSection({
  eyebrow = 'JOIN SISIMOVE',
  title =
    'Your journey is better when you do not travel it alone.',
  description =
    'Join people travelling your way, discover journeys, and become part of a community built around sharing the road.',
  actionContent,
  secondaryContent,
  headingId = DEFAULT_HEADING_ID,
  className,
  ...props
}: CommunityCtaSectionProps) {
  return (
    <section
      id="community"
      aria-labelledby={headingId}
      className={cn(
        'w-full',
        className,
      )}
      {...props}
    >
      <div
        className={[
          'mx-auto',
          'w-full',
          'max-w-5xl',
          'rounded-[var(--radius-2xl)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--brand-soft)]',
          'px-6',
          'py-12',
          'sm:px-10',
          'sm:py-14',
          'lg:px-16',
          'lg:py-16',
        ].join(' ')}
      >
        <div className="mx-auto max-w-3xl text-center">
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
              'lg:text-[2.75rem]',
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
                'sm:text-lg',
                'sm:leading-8',
              ].join(' ')}
            >
              {description}
            </p>
          ) : null}

          {actionContent || secondaryContent ? (
            <div
              className={[
                'mt-8',
                'flex',
                'flex-col',
                'items-center',
                'justify-center',
                'gap-3',
                'sm:flex-row',
              ].join(' ')}
            >
              {actionContent ? (
                <div className="shrink-0">
                  {actionContent}
                </div>
              ) : null}

              {secondaryContent ? (
                <div className="shrink-0">
                  {secondaryContent}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}