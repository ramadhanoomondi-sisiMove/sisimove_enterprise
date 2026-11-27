
import type { ReactNode } from 'react';
import { cn } from '@/foundation/utils/cn';

export type JourneyCompletionDetailsLayoutVariant =
  | 'equal'
  | 'main-sidebar';

interface JourneyCompletionDetailsLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: JourneyCompletionDetailsLayoutVariant;
}

const layoutVariants: Record<
  JourneyCompletionDetailsLayoutVariant,
  string
> = {
  equal: 'lg:grid-cols-2',
  'main-sidebar': 'lg:grid-cols-12',
};

export default function JourneyCompletionDetailsLayout({
  children,
  className,
  variant = 'main-sidebar',
}: JourneyCompletionDetailsLayoutProps) {
  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-5 lg:gap-6',
        layoutVariants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
