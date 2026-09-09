// -----------------------------------------------------------------------------
// sisiMove — Traveller Search
// -----------------------------------------------------------------------------
//
// Public traveller discovery search form.
//
// Responsibilities:
// - Compose origin, destination, and date fields.
// - Manage local form input state.
// - Validate required search inputs.
// - Emit a normalized search request to the parent.
// - Remain independent of API/data-fetching implementation.
//
// Architectural boundary:
// - This component owns local presentation/form state only.
// - Search execution belongs to the parent.
// - No API client, repository, or application service is used here.
//
// -----------------------------------------------------------------------------

'use client';

import {
  type FormEvent,
  useState,
} from 'react';

import {
  DateField,
  LocationField,
  SearchSubmit,
} from './index';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerSearchValues {
  from: string;
  to: string;
  date: string;
}

export interface TravellerSearchProps {
  initialValues?: Partial<TravellerSearchValues>;
  onSubmit?: (values: TravellerSearchValues) => void;
  loading?: boolean;
  disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_VALUES: TravellerSearchValues = {
  from: '',
  to: '',
  date: '',
};

// -----------------------------------------------------------------------------
// Traveller Search
// -----------------------------------------------------------------------------

export function TravellerSearch({
  initialValues,
  onSubmit,
  loading = false,
  disabled = false,
}: TravellerSearchProps) {
  const [values, setValues] = useState<TravellerSearchValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });

  const [error, setError] = useState<string | undefined>();

  const isDisabled = disabled || loading;

  // ---------------------------------------------------------------------------
  // Field Change
  // ---------------------------------------------------------------------------

  function updateField(
    field: keyof TravellerSearchValues,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError(undefined);
    }
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    const from = values.from.trim();
    const to = values.to.trim();
    const date = values.date.trim();

    if (!from || !to || !date) {
      setError(
        'Enter where you are travelling from, where you are going, and when.',
      );
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      setError(
        'Your starting location and destination must be different.',
      );
      return;
    }

    setError(undefined);

    onSubmit?.({
      from,
      to,
      date,
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
    >
      <div
        className={[
          'rounded-[var(--radius-xl)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-3',
          'shadow-[var(--shadow-md)]',
          'sm:p-4',
        ].join(' ')}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Search Fields                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'grid',
            'gap-3',
            'md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]',
            'md:items-end',
          ].join(' ')}
        >
          {/* --------------------------------------------------------------- */}
          {/* From                                                            */}
          {/* --------------------------------------------------------------- */}

          <LocationField
            id="traveller-search-from"
            name="from"
            label="From"
            placeholder="Nairobi"
            value={values.from}
            onChange={(event) =>
              updateField('from', event.target.value)
            }
            disabled={isDisabled}
            required
          />

          {/* --------------------------------------------------------------- */}
          {/* To                                                              */}
          {/* --------------------------------------------------------------- */}

          <LocationField
            id="traveller-search-to"
            name="to"
            label="To"
            placeholder="Kisumu"
            value={values.to}
            onChange={(event) =>
              updateField('to', event.target.value)
            }
            disabled={isDisabled}
            required
          />

          {/* --------------------------------------------------------------- */}
          {/* Date                                                            */}
          {/* --------------------------------------------------------------- */}

          <DateField
            id="traveller-search-date"
            name="date"
            label="When"
            value={values.date}
            onChange={(event) =>
              updateField('date', event.target.value)
            }
            disabled={isDisabled}
            required
          />

          {/* --------------------------------------------------------------- */}
          {/* Submit                                                          */}
          {/* --------------------------------------------------------------- */}

          <SearchSubmit
            loading={loading}
            disabled={disabled}
            className="w-full md:min-w-32"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Form Error                                                        */}
        {/* ----------------------------------------------------------------- */}

        {error && (
          <p
            role="alert"
            className={[
              'mt-3',
              'text-sm',
              'leading-6',
              'text-[var(--danger)]',
            ].join(' ')}
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}