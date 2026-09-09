// -----------------------------------------------------------------------------
// sisiMove — Date Field
// -----------------------------------------------------------------------------
//
// Reusable date input for the public traveller search.
//
// Responsibilities:
// - Provide a semantic date input.
// - Reuse the shared Input primitive.
// - Support controlled form state through standard input props.
// - Remain independent of search/API logic.
//
// Architectural boundary:
// - This component owns presentation only.
// - Date validation belongs to the consuming form/application layer.
// - Search/API concerns do not belong here.
//
// -----------------------------------------------------------------------------

import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react';

import { Input } from '../../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DateFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  /**
   * Visible field label.
   */
  label?: string;

  /**
   * Non-error supporting text displayed below the field.
   */
  helperText?: string;

  /**
   * Validation error displayed by the shared Input primitive.
   */
  error?: string;

  /**
   * Optional content rendered before the date input.
   */
  leadingContent?: ReactNode;

  /**
   * Optional content rendered after the date input.
   */
  trailingContent?: ReactNode;

  /**
   * Whether the field should occupy the available width.
   */
  fullWidth?: boolean;
}

// -----------------------------------------------------------------------------
// Date Field
// -----------------------------------------------------------------------------

export function DateField({
  label,
  helperText,
  error,
  leadingContent,
  trailingContent,
  fullWidth = true,
  ...props
}: DateFieldProps) {
  return (
    <Input
      {...props}
      type="date"
      label={label}
      helperText={helperText}
      error={error}
      leadingContent={leadingContent}
      trailingContent={trailingContent}
      fullWidth={fullWidth}
    />
  );
}