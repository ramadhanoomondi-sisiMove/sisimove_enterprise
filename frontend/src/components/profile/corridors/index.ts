// -----------------------------------------------------------------------------
// sisiMove — Profile Corridors Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authenticated profile corridor presentation
// components.
//
// Architecture:
//
//     Profile
//        │
//        ▼
//     CorridorsSection
//        │
//        ▼
//     CorridorList
//        │
//        ▼
//     CorridorItem
//
// Data ownership:
//
//     Traveller Profile feature
//              │
//              ▼
//     TravellerProfileCorridor
//              │
//              ▼
//     Presentation components
//
// IMPORTANT:
// - TravellerProfileCorridor is owned by the Traveller Profile feature.
// - This barrel must not define or re-export an obsolete local `Corridor`
//   presentation model.
// - Corridor components consume TravellerProfileCorridor directly.
// - No API, fetching, mutation, or domain logic belongs here.
//
// -----------------------------------------------------------------------------

export {
  CorridorsSection,
} from './corridors-section';

export type {
  CorridorsSectionProps,
} from './corridors-section';

export {
  CorridorList,
} from './corridor-list';

export type {
  CorridorListProps,
} from './corridor-list';

export {
  CorridorItem,
} from './corridor-item';

export type {
  CorridorItemProps,
} from './corridor-item';