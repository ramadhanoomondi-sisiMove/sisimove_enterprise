// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Vehicle
// -----------------------------------------------------------------------------
//
// Compact presentation component for the vehicle section of a public Journey
// marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//                              ↑
//                           this block
//
// This component owns only the `VEHICLE` portion.
//
// Intended presentation:
//
//   [ vehicle image ]
//   Nissan X-Trail · 2022
//   Black
//
// The component is deliberately compact. It is not a vehicle detail card.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - displays the public vehicle information supplied by the parent;
// - displays the vehicle image when a public asset is available;
// - delegates image rendering to the shared PublicAssetImage component;
// - gracefully handles an absent image;
// - contains no vehicle business rules.
//
// It deliberately does not:
//
// - fetch vehicle data;
// - resolve vehicle ownership;
// - determine whether a vehicle is verified;
// - determine whether a vehicle is active;
// - construct asset URLs;
// - determine Journey eligibility;
// - contain booking logic;
// - modify the Journey or Vehicle domain models.
//
// PUBLIC ASSET BOUNDARY
// ---------------------
//
// `PublicAssetImage` remains the shared adapter around Next.js Image.
//
// This component decides only:
//
//   "This asset represents this vehicle."
//
// It does not know how the asset URL is stored or resolved.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The parent JourneyMarketplaceCard owns:
//
// - the vehicle column width;
// - the vehicle column position;
// - marketplace column padding;
// - the column separator.
//
// This component therefore deliberately does NOT:
//
// - define a fixed marketplace column width;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding;
// - use a fixed desktop image size.
//
// The image and vehicle typography contract progressively with the rest of
// the marketplace row.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//   --border
//   --background-subtle
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------

import { PublicAssetImage } from '@/components/landing/shared/assets';
import type { PublicAsset } from '@/features/assets/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardVehicleProps {
  /**
   * Vehicle manufacturer / make.
   *
   * Example:
   *
   *   "Nissan"
   */
  readonly make: string;

  /**
   * Vehicle model.
   *
   * Example:
   *
   *   "X-Trail"
   */
  readonly model: string;

  /**
   * Optional vehicle model year.
   */
  readonly year?: number | null;

  /**
   * Optional public vehicle colour.
   *
   * Example:
   *
   *   "Black"
   */
  readonly color?: string | null;

  /**
   * Optional public vehicle image asset.
   *
   * When absent, vehicle information remains visible without an image.
   */
  readonly asset?: PublicAsset | null;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

/**
 * Builds the compact vehicle identity displayed beneath the image.
 *
 * Example:
 *
 *   Nissan X-Trail · 2022
 *
 * This helper performs presentation formatting only.
 */
function formatVehicleName(
  make: string,
  model: string,
  year?: number | null,
): string {
  const identity = [make.trim(), model.trim()]
    .filter(Boolean)
    .join(' ');

  if (!year) {
    return identity;
  }

  return `${identity} · ${year}`;
}

/**
 * Normalises optional colour text for presentation.
 *
 * Empty or whitespace-only values are treated as absent.
 */
function formatVehicleColor(
  color?: string | null,
): string | null {
  const value = color?.trim();

  return value || null;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCardVehicle({
  make,
  model,
  year,
  color,
  asset,
  className,
}: JourneyCardVehicleProps) {
  const vehicleName = formatVehicleName(make, model, year);
  const vehicleColor = formatVehicleColor(color);

  const vehicleLabel = vehicleName || 'Vehicle';

  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Vehicle content boundary
        // -------------------------------------------------------------------
        //
        // The parent owns the marketplace column width, separator, and outer
        // padding. This component controls only the internal composition.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',

        // -------------------------------------------------------------------
        // Progressive internal density
        // -------------------------------------------------------------------

        'gap-1.5',
        'sm:gap-2',
        'md:gap-2.5',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Vehicle image                                                        */}
      {/* ------------------------------------------------------------------- */}
      {asset ? (
        <div
          className={[
            'relative',
            'w-full',
            'max-w-28',
            'sm:max-w-32',
            'md:max-w-36',

            // Progressive image height.
            'h-14',
            'sm:h-16',
            'md:h-20',

            'overflow-hidden',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--background-subtle)]',
          ].join(' ')}
        >
          <PublicAssetImage
            asset={asset}
            alt={`${vehicleLabel} vehicle`}
            fallbackAlt={`${vehicleLabel} vehicle image`}
            fill
            sizes="(max-width: 639px) 112px, (max-width: 767px) 128px, 144px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={[
            'flex',
            'w-full',
            'max-w-28',
            'sm:max-w-32',
            'md:max-w-36',

            // Keep the fallback image geometry identical to the real asset.
            'h-14',
            'sm:h-16',
            'md:h-20',

            'items-center',
            'justify-center',
            'overflow-hidden',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--background-subtle)]',
            'text-[var(--foreground-subtle)]',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={[
              'h-5',
              'w-5',
              'sm:h-6',
              'sm:w-6',
              'md:h-8',
              'md:w-8',
            ].join(' ')}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 17h14M6.5 17V9.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V17M4 17h16M8 12h8M7 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0-0-3Zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0-0-3Z"
            />
          </svg>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle identity                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <p
          className={[
            'min-w-0',
            'truncate',
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-semibold',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
          title={vehicleLabel}
        >
          {vehicleLabel}
        </p>

        {/* --------------------------------------------------------------- */}
        {/* Colour                                                            */}
        {/* --------------------------------------------------------------- */}

        {vehicleColor && (
          <p
            className={[
              'mt-0.5',
              'min-w-0',
              'truncate',
              'text-[9px]',
              'sm:text-[10px]',
              'md:text-xs',
              'leading-tight',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
            title={vehicleColor}
          >
            {vehicleColor}
          </p>
        )}
      </div>
    </div>
  );
}