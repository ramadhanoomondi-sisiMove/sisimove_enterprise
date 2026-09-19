// -----------------------------------------------------------------------------
// sisiMove — Trust API Exports
// -----------------------------------------------------------------------------
//
// Public API boundary for the Trust feature's HTTP adapters.
//
// Public marketplace reads:
//   getPublicTravellerTrust()
//   getPublicTrustProfile()
//
// Authenticated Trust reads:
//   getTravellerTrust()
//
// Keeping these exports explicit prevents consumers from importing individual
// API implementation files and makes the public/authenticated boundary clear.
// -----------------------------------------------------------------------------

export {
  getPublicTrustProfile,
} from './public-trust.api';

export {
  getTravellerTrust,
} from './trust.api';