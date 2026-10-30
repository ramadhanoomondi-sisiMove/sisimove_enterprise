
import type { ReactNode } from 'react';

import {
  Container,
  type ContainerSize,
} from '@/components/ui';

export interface ProviderPageContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

export function ProviderPageContainer({
  children,
  size = '2xl',
  className,
}: ProviderPageContainerProps) {
  return (
    <Container
      size={size}
      className={className}
    >
      {children}
    </Container>
  );
}
