
// -----------------------------------------------------------------------------
// sisiMove — Foundation Storage Barrel
// -----------------------------------------------------------------------------
//
// Public storage boundary.
//
// Consumers should import storage contracts and adapters from this barrel
// rather than reaching into individual implementation files.
//
// -----------------------------------------------------------------------------

export type {
  Storage,
} from './storage';

export {
  localStorageAdapter,
} from './local-storage';

export {
  sessionStorageAdapter,
} from './session-storage';