// -----------------------------------------------------------------------------
// Identity Domain Events
// -----------------------------------------------------------------------------
//
// Central export surface for all Identity domain events.
//
// Events are grouped by their aggregate/bounded responsibility:
//
// - Identity
// - Identity Role
// - Verification
// - Verification Request
// - Role
// - Permission
// - Role Permission
//
// Consumers should import Identity domain events from this index rather than
// reaching into individual event files.
//
// -----------------------------------------------------------------------------

// =============================================================================
// BASE DOMAIN EVENT
// =============================================================================

export { IdentityDomainEvent } from './identity-domain.event';

// =============================================================================
// IDENTITY EVENTS
// =============================================================================

export { IdentityCreatedEvent } from './identity-created.event';

export { IdentityActivatedEvent } from './identity-activated.event';

export { IdentitySuspendedEvent } from './identity-suspended.event';

export { IdentityClosedEvent } from './identity-closed.event';

export { IdentityEmailChangedEvent } from './identity-email-changed.event';

export { IdentityPhoneNumberChangedEvent } from './identity-phone-number-changed.event';

// =============================================================================
// IDENTITY ROLE EVENTS
// =============================================================================

export { IdentityRoleAssignedEvent } from './identity-role-assigned.event';

export { IdentityRoleRevokedEvent } from './identity-role-revoked.event';

// =============================================================================
// VERIFICATION EVENTS
// =============================================================================

export { VerificationCreatedEvent } from './verification-created.event';

export { VerificationApprovedEvent } from './verification-approved.event';

export { VerificationRejectedEvent } from './verification-rejected.event';

export { VerificationExpiredEvent } from './verification-expired.event';

// =============================================================================
// VERIFICATION REQUEST EVENTS
// =============================================================================

export { VerificationRequestCreatedEvent } from './verification-request-created.event';

export { VerificationRequestSubmittedEvent } from './verification-request-submitted.event';

export { VerificationRequestApprovedEvent } from './verification-request-approved.event';

export { VerificationRequestRejectedEvent } from './verification-request-rejected.event';

export { VerificationRequestCancelledEvent } from './verification-request-cancelled.event';

// =============================================================================
// ROLE EVENTS
// =============================================================================

export { RoleCreatedEvent } from './role-created.event';

export { RoleActivatedEvent } from './role-activated.event';

export { RoleDeactivatedEvent } from './role-deactivated.event';

// =============================================================================
// PERMISSION EVENTS
// =============================================================================

export { PermissionCreatedEvent } from './permission-created.event';

export { PermissionActivatedEvent } from './permission-activated.event';

export { PermissionDeactivatedEvent } from './permission-deactivated.event';

// =============================================================================
// ROLE PERMISSION EVENTS
// =============================================================================

export { RolePermissionAssignedEvent } from './role-permission-assigned.event';

export { RolePermissionRevokedEvent } from './role-permission-revoked.event';
