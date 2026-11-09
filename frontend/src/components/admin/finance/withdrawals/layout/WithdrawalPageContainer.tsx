
import type { HTMLAttributes, ReactNode } from 'react';

import { Container, type ContainerSize } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalPageContainerProps
  extends HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  padded?: boolean;
  children?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalPageContainer({
  size = '2xl',
  padded = true,
  children,
  className,
  ...props
}: WithdrawalPageContainerProps) {
  return (
    <main
      {...props}
      className={cn(
        'min-h-full',
        'py-6',
        'sm:py-8',
        className,
      )}
    >
      <Container size={size} padded={padded}>
        {children}
      </Container>
    </main>
  );
}

export default WithdrawalPageContainer;
