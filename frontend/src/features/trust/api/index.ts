// -----------------------------------------------------------------------------
// sisiMove — Public Trust API
// -----------------------------------------------------------------------------
//
// Public API barrel for the frontend Trust feature.
//
// Consumers should import Trust API operations through this barrel rather than
// depending on individual implementation files.
//
// Example:
//
//   import {
//     getTravellerTrust,
//     getPublicTrustProfile,
//   } from '@/features/trust/api';
//
// -----------------------------------------------------------------------------

export {
  getTravellerTrust,
  getPublicTrustProfile,
} from './public-trust-api';

