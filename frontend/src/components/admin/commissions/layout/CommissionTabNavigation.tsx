// src/components/admin/commissions/layout/CommissionTabNavigation.tsx

import Link from 'next/link';

export interface CommissionTabItem {
  readonly label: string;
  readonly href: string;
  readonly disabled?: boolean;
}

export interface CommissionTabNavigationProps {
  readonly items: readonly CommissionTabItem[];
  readonly activeHref: string;
  readonly ariaLabel?: string;
  readonly className?: string;
}

export function CommissionTabNavigation({
  items,
  activeHref,
  ariaLabel = 'Commission sections',
  className,
}: CommissionTabNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={[
        'w-full',
        'overflow-x-auto',
        'border-b',
        'border-[var(--border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex min-w-max items-center gap-6">
        {items.map((item) => {
          const isActive = item.href === activeHref;

          if (item.disabled) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                className={[
                  'inline-flex',
                  'min-h-11',
                  'items-center',
                  'border-b-2',
                  'border-transparent',
                  'text-sm',
                  'font-medium',
                  'text-[var(--foreground-subtle)]',
                  'cursor-not-allowed',
                ].join(' ')}
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'inline-flex',
                'min-h-11',
                'items-center',
                'border-b-2',
                'text-sm',
                'font-medium',
                'transition-colors',
                'duration-150',
                'whitespace-nowrap',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--brand)]',
                'focus-visible:outline-offset-2',
                isActive
                  ? 'border-[var(--brand)] text-[var(--brand)]'
                  : [
                      'border-transparent',
                      'text-[var(--foreground-muted)]',
                      'hover:border-[var(--border-strong)]',
                      'hover:text-[var(--foreground)]',
                    ].join(' '),
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}