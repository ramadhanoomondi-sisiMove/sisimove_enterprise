// -----------------------------------------------------------------------------
// sisiMove — Journey Photos Step
// -----------------------------------------------------------------------------
//
// Presentation boundary for the Photos step of Journey creation.
//
// Architectural boundary:
// - Assets are existing records owned by the Assets domain.
// - Journey only associates existing Asset public identifiers.
// - This component does NOT upload assets.
// - It does NOT create Asset records.
// - It does NOT attach or detach Journey assets.
// - It does NOT call the Journey API.
// - Asset upload/selection UI is supplied by the parent workflow.
// - The parent workflow owns persistence and navigation.
//
// This separation is intentional:
//
//     Assets domain
//          │
//          ├── owns Asset lifecycle
//          ├── owns upload
//          └── owns Asset management
//                  │
//                  │ existing assetPublicId
//                  ▼
//             Journey workflow
//                  │
//                  ▼
//             Journey aggregate
//                  │
//                  └── owns JourneyAsset attachment
//
// The Photos step is therefore only a presentation boundary around that
// workflow. It does not become an owner of either domain's behavior.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPhotosStepProps {
  /**
   * Asset workflow UI supplied by the route/workflow owner.
   *
   * The supplied UI may compose existing Assets-domain upload or selection
   * components, but this step does not own those operations.
   */
  children: ReactNode;

  /**
   * Optional additional classes supplied by the composition owner.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPhotosStep({
  children,
  className,
}: JourneyPhotosStepProps) {
  return (
    <div
      className={[
        'space-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <section aria-labelledby="journey-photos-heading">
        <div className="mb-3">
          <h2
            id="journey-photos-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey photos
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Add photos that help travellers identify the vehicle or understand
            the Journey.
          </p>
        </div>

        {children}
      </section>
    </div>
  );
}