// -----------------------------------------------------------------------------
// sisiMove — Search Submit
// -----------------------------------------------------------------------------
//
// Submit action for the public Journey search.
//
// Responsibilities:
// - Provide a consistent search action.
// - Reuse the shared Button primitive.
// - Support loading and disabled states.
// - Remain independent of search/API implementation.
//
// Architectural boundary:
// - This component owns presentation only.
// - Search execution belongs to the consuming feature/form.
// - No API, navigation, or search state is handled here.
//
// -----------------------------------------------------------------------------

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import { Button } from '../../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface SearchSubmitProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children'
  > {
  /**
   * Visible button label.
   */
  label?: string;

  /**
   * Whether the button is currently performing an action.
   */
  loading?: boolean;

  /**
   * Optional content rendered before the label.
   */
  leadingIcon?: ReactNode;

  /**
   * Optional content rendered after the label.
   */
  trailingIcon?: ReactNode;
}

// -----------------------------------------------------------------------------
// Search Submit
// -----------------------------------------------------------------------------

export function SearchSubmit({
  label = 'Find a journey',
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled = false,
  type = 'submit',
  ...props
}: SearchSubmitProps) {
  return (
    <Button
      {...props}
      type={type}
      variant="primary"
      size="md"
      loading={loading}
      disabled={disabled || loading}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
    >
      {label}
    </Button>
  );
}

