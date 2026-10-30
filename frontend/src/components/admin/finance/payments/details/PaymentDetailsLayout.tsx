// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Details Layout
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentDetailsLayoutProps {
  header?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentDetailsLayout({
  header,
  toolbar,
  children,
  aside,
  className,
}: PaymentDetailsLayoutProps) {
  const hasAside = aside !== null && aside !== undefined && aside !== false;

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-7xl flex-col gap-6',
        className,
      )}
    >
      {toolbar ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          {toolbar}
        </div>
      ) : null}

      {header ? (
        <div className="min-w-0">
          {header}
        </div>
      ) : null}

      <div
        className={cn(
          'grid min-w-0 grid-cols-1 items-start gap-6',
          hasAside
            ? 'xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]'
            : undefined,
        )}
      >
        <main className="flex min-w-0 flex-col gap-6">
          {children}
        </main>

        {hasAside ? (
          <aside className="flex min-w-0 flex-col gap-6">
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export default PaymentDetailsLayout;
