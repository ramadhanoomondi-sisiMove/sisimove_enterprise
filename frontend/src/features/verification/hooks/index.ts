// -----------------------------------------------------------------------------
// sisiMove — Verification Hooks
// -----------------------------------------------------------------------------
//
// Public export surface for Verification feature hooks.
//
// Hooks are grouped by responsibility:
//
// - Verification aggregate
// - Verification Requests
// - Verification Request detail
// - Verification Request submission
// - Verification Request cancellation
//
// Consumers should import Verification hooks and their public types from this
// barrel rather than reaching into individual hook files.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Verification
// =============================================================================

export {
  useVerification,
} from './use-verification';

export type {
  UseVerificationOptions,
  UseVerificationResult,
} from './use-verification';


// =============================================================================
// Verification Requests
// =============================================================================

export {
  useVerificationRequests,
} from './use-verification-requests';

export type {
  UseVerificationRequestsResult,
} from './use-verification-requests';


// =============================================================================
// Verification Request
// =============================================================================

export {
  useVerificationRequest,
} from './use-verification-request';

export type {
  UseVerificationRequestResult,
} from './use-verification-request';


// =============================================================================
// Submit Verification Request
// =============================================================================

export {
  useSubmitVerificationRequest,
} from './use-submit-verification-request';

export type {
  UseSubmitVerificationRequestResult,
} from './use-submit-verification-request';


// =============================================================================
// Cancel Verification Request
// =============================================================================

export {
  useCancelVerificationRequest,
} from './use-cancel-verification-request';

export type {
  UseCancelVerificationRequestResult,
} from './use-cancel-verification-request';