
import type { HTMLAttributes, ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldPageContainerProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  width?: 'default' | 'wide' | 'full';
}

const WIDTH_TO_CONTAINER_SIZE = {
  default: '2xl',
  wide: 'full',
  full: 'full',
} as const;

export function AccountHoldPageContainer({
  children,
  width = 'default',
  className,
  ...props
}: AccountHoldPageContainerProps) {
  return (
    <main
      {...props}
      className={cn('page-shell', className)}
    >
      <Container
        size={WIDTH_TO_CONTAINER_SIZE[width]}
        padded
      >
        {children}
      </Container>
    </main>
  );
}
