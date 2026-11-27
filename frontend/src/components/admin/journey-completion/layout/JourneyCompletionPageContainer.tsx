
import type { ReactNode } from 'react';

import { Container } from '@/components/ui';

export interface JourneyCompletionPageContainerProps {
  children: ReactNode;
  className?: string;
}

export function JourneyCompletionPageContainer({
  children,
  className,
}: JourneyCompletionPageContainerProps) {
  return (
    <main className="page-shell">
      <Container
        size="2xl"
        className={className ?? 'page-container'}
      >
        {children}
      </Container>
    </main>
  );
}
