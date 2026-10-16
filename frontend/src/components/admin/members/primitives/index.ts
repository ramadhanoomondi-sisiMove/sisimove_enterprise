
// -----------------------------------------------------------------------------
// sisiMove — Admin Members Primitives
// -----------------------------------------------------------------------------
//
// Public barrel for reusable member UI primitives.
//
// Responsibilities:
// - Expose the Layer 1 presentation components.
// - Provide stable imports for higher-level member components.
// - Keep implementation details inside their individual modules.
//
// Non-responsibilities:
// - Fetching data.
// - Defining domain contracts.
// - Adding business logic.
//
// -----------------------------------------------------------------------------

export {
  MemberDataSection,
  type MemberDataSectionProps,
} from './member-data-section';

export {
  MemberAvatar,
  type MemberAvatarProps,
} from './member-avatar';

export {
  MemberStatusBadge,
  type MemberStatus,
  type MemberStatusBadgeProps,
} from './member-status-badge';

export {
  MemberVerificationBadge,
  type MemberVerificationStatus,
  type MemberVerificationBadgeProps,
} from './member-verification-badge';

export {
  MemberTrustIndicator,
  type MemberTrustStatus,
  type MemberTrustIndicatorProps,
} from './member-trust-indicator';
