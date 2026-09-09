// -----------------------------------------------------------------------------
// sisiMove — Location Field
// -----------------------------------------------------------------------------
//
// Reusable location input for the public traveller search.
//
// Responsibilities:
// - Provide a semantic location input.
// - Reuse the shared Input primitive.
// - Support controlled form state through standard input props.
// - Remain independent of location/search services.
//
// Architectural boundary:
// - This component owns presentation only.
// - Location suggestions/autocomplete belong to the consuming feature.
// - Geocoding, route resolution, and search/API concerns do not belong here.
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

export interface LocationFieldProps
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
   * Optional content rendered before the input.
   */
  leadingContent?: ReactNode;

  /**
   * Optional content rendered after the input.
   */
  trailingContent?: ReactNode;

  /**
   * Whether the field should occupy the available width.
   */
  fullWidth?: boolean;
}

// -----------------------------------------------------------------------------
// Location Field
// -----------------------------------------------------------------------------

export function LocationField({
  label,
  helperText,
  error,
  leadingContent,
  trailingContent,
  fullWidth = true,
  placeholder = 'Enter a location',
  autoComplete = 'off',
  ...props
}: LocationFieldProps) {
  return (
    <Input
      {...props}
      type="text"
      label={label}
      helperText={helperText}
      error={error}
      leadingContent={leadingContent}
      trailingContent={trailingContent}
      fullWidth={fullWidth}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode="text"
    />
  );
}