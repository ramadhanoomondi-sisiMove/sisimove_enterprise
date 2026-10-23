
import type { HTMLAttributes, ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { cn } from '@/foundation/utils/cn';

export interface JourneyPageContainerProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  width?: 'default' | 'wide' | 'full';
  spacing?: 'compact' | 'default' | 'relaxed';
}

const widthMap = {
  default: '2xl',
  wide: 'full',
  full: 'full',
} as const;

const spacingClasses = {
  compact: 'py-4 sm:py-5',
  default: 'py-6 sm:py-8',
  relaxed: 'py-8 sm:py-10',
} as const;

export function JourneyPageContainer({
  children,
  width = 'wide',
  spacing = 'default',
  className,
  ...props
}: JourneyPageContainerProps) {
  return (
    <main
      {...props}
      className={cn(
        'min-h-screen w-full bg-[var(--background-subtle)]',
        className,
      )}
    >
      <Container
        size={widthMap[width]}
        className={cn(spacingClasses[spacing])}
      >
        {children}
      </Container>
    </main>
  );
}

export default JourneyPageContainer;
