
/**
 * sisiMove — Trust Page Container
 *
 * Shared page-layout wrapper for the Trust administration feature.
 *
 * Responsibilities:
 * - Provide consistent responsive content width and horizontal spacing.
 * - Reuse the shared design-system Container.
 * - Allow Trust pages to select a supported content width.
 * - Support page-level HTML attributes and additional styling.
 *
 * Non-responsibilities:
 * - Rendering page headers or navigation.
 * - Fetching Trust data.
 * - Defining a separate content-width system.
 */

import type { HTMLAttributes, ReactNode } from 'react';

import {
  Container,
  type ContainerSize,
} from '@/components/ui/container';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustPageContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Maximum content width, using the shared design-system sizes.
   */
  size?: ContainerSize;

  /**
   * Whether responsive horizontal padding is applied.
   * Defaults to true.
   */
  padded?: boolean;

  /**
   * Page content.
   */
  children?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustPageContainer({
  size = '2xl',
  padded = true,
  children,
  className,
  ...props
}: TrustPageContainerProps) {
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

export default TrustPageContainer;
