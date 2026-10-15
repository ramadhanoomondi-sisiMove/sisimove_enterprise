
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Overview Link Card
 * -----------------------------------------------------------------------------
 *
 * Navigational card for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - provide a clear entry point to an administration feature;
 * - display a Lucide icon, title, and supporting description;
 * - provide consistent styling using sisiMove design tokens;
 * - preserve native Next.js link navigation and accessibility.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch data.
 * - It does not define application routes.
 * - The caller supplies the destination through href.
 *
 * -----------------------------------------------------------------------------
 */

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui';


// =============================================================================
// Types
// =============================================================================

interface OverviewLinkCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}


// =============================================================================
// Component
// =============================================================================

export default function OverviewLinkCard({
  title,
  description,
  href,
  icon: Icon,
}: OverviewLinkCardProps) {
  return (
    <Link
      href={href}
      aria-label={`${title}: ${description}`}
      className={[
        'group',
        'block',
        'h-full',
        'rounded-[var(--radius-xl)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <Card
        variant="default"
        padding="lg"
        interactive
        className={[
          'h-full',
          'rounded-[var(--radius-xl)]',
          'transition-all',
          'duration-150',
          'group-hover:-translate-y-0.5',
          'group-hover:border-[var(--border-strong)]',
          'group-hover:shadow-[var(--shadow-md)]',
        ].join(' ')}
      >
        <div className="flex h-full items-start gap-4">
          {/* --------------------------------------------------------------- */}
          {/* Feature Icon                                                    */}
          {/* --------------------------------------------------------------- */}

          <div
            aria-hidden="true"
            className={[
              'flex',
              'h-11',
              'w-11',
              'shrink-0',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-lg)]',
              'bg-[var(--brand-soft)]',
              'text-[var(--brand)]',
              'transition-colors',
              'duration-150',
              'group-hover:bg-[var(--background-muted)]',
            ].join(' ')}
          >
            <Icon
              size={21}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Link Information                                                */}
          {/* --------------------------------------------------------------- */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-6 text-[var(--foreground)] transition-colors group-hover:text-[var(--brand)]">
                {title}
              </h3>

              <span
                aria-hidden="true"
                className="shrink-0 text-lg leading-6 text-[var(--foreground-subtle)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
              >
                →
              </span>
            </div>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
