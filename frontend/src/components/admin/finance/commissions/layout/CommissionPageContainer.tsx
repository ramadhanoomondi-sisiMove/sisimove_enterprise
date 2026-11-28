// src/components/admin/commissions/layout/CommissionPageContainer.tsx

import type { ReactNode } from 'react';

import {
  Container,
  type ContainerProps,
} from '@/components/ui';

export interface CommissionPageContainerProps
  extends Omit<ContainerProps, 'children'> {
  readonly children: ReactNode;
}

export function CommissionPageContainer({
  children,
  size = '2xl',
  padded = true,
  className,
  ...props
}: CommissionPageContainerProps) {
  return (
    <Container
      {...props}
      size={size}
      padded={padded}
      className={className}
    >
      {children}
    </Container>
  );
}