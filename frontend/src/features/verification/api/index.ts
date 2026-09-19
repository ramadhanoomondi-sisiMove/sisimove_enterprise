// -----------------------------------------------------------------------------
// sisiMove — Verification API Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the Verification feature's HTTP API operations.
//
// API boundaries:
//
// - Current authenticated Verification
// - Explicit Verification resource
// - Verification Requests
// - Verification Request submission
// - Verification Request cancellation
//
// Consumers should import Verification API operations from this barrel rather
// than reaching into individual API modules.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Verification
// =============================================================================

export {
  createVerification,
  getMyVerification,
  getVerification,
} from './verification.api';


// =============================================================================
// Verification Requests
// =============================================================================

export {
  getVerificationRequests,
  getVerificationRequest,
} from './verification-requests.api';


// =============================================================================
// Submit Verification Request
// =============================================================================

export {
  submitVerificationRequest,
} from './submit-verification-request.api';


// =============================================================================
// Cancel Verification Request
// =============================================================================

export {
  cancelVerificationRequest,
} from './cancel-verification-request.api';