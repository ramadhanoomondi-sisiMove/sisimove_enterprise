// src/components/ui/container.tsx

// -----------------------------------------------------------------------------
// sisiMove — Container
// -----------------------------------------------------------------------------
//
// Reusable layout container for the sisiMove design system.
//
// Responsibilities:
// - Constrain content to the application's responsive content width
// - Provide consistent horizontal spacing
// - Support configurable maximum widths
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ContainerSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full';

export interface ContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Maximum content width.
   */
  size?: ContainerSize;

  /**
   * Whether to apply responsive horizontal padding.
   *
   * Defaults to true.
   */
  padded?: boolean;

  /**
   * Container content.
   */
  children?: ReactNode;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-none',
};

const paddingClasses = [
  'px-4',
  'sm:px-6',
  'lg:px-8',
].join(' ');

// -----------------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------------

export function Container({
  size = 'xl',
  padded = true,
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        'mx-auto',
        'w-full',
        sizeClasses[size],
        padded && paddingClasses,
        className,
      )}
    >
      {children}
    </div>
  );
}