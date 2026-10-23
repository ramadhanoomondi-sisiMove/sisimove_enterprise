// src/features/admin/boardings/layout/BoardingPageContainer.tsx

import type { HTMLAttributes, ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { cn } from '@/foundation/utils/cn';

export interface BoardingPageContainerProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  width?: 'default' | 'wide' | 'full';
}

const containerSizeMap = {
  default: '2xl',
  wide: 'full',
  full: 'full',
} as const;

export function BoardingPageContainer({
  children,
  width = 'default',
  className,
  ...props
}: BoardingPageContainerProps) {
  return (
    <main
      {...props}
      className={cn('page-shell', className)}
    >
      <Container
        size={containerSizeMap[width]}
        padded
        className="py-6 sm:py-8"
      >
        {children}
      </Container>
    </main>
  );
}
