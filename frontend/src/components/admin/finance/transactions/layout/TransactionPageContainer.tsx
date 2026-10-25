
import type { HTMLAttributes, ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { cn } from '@/foundation/utils/cn';

export interface TransactionPageContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padded?: boolean;
}

export function TransactionPageContainer({
  children,
  size = '2xl',
  padded = true,
  className,
  ...props
}: TransactionPageContainerProps) {
  return (
    <Container
      {...props}
      size={size}
      padded={padded}
      className={cn('py-6 sm:py-8', className)}
    >
      {children}
    </Container>
  );
}

export default TransactionPageContainer;
