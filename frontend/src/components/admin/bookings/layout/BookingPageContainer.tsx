
import type { ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { cn } from '@/foundation/utils/cn';

interface BookingPageContainerProps {
  children: ReactNode;
  className?: string;
}

export function BookingPageContainer({
  children,
  className,
}: BookingPageContainerProps) {
  return (
    <Container
      size="full"
      className={cn('flex flex-col gap-6 py-6', className)}
    >
      {children}
    </Container>
  );
}

export type { BookingPageContainerProps };
