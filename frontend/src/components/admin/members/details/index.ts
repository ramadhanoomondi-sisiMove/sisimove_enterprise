/**
 * sisiMove — Admin Member Details Barrel
 *
 * Public exports for the Admin Members detail components.
 * Keep component exports centralized for consistent imports across the feature.
 */

// -----------------------------------------------------------------------------
// Member Detail Header & Navigation
// -----------------------------------------------------------------------------

export {
  MemberDetailHeader,
} from "./member-detail-header";

export type {
  MemberDetailHeaderProps,
} from "./member-detail-header";

export {
  MemberDetailNavigation,
  MEMBER_DETAIL_SECTIONS,
} from "./member-detail-navigation";

export type {
  MemberDetailNavigationProps,
  MemberDetailSection,
} from "./member-detail-navigation";

// -----------------------------------------------------------------------------
// Identity & Profile
// -----------------------------------------------------------------------------

export {
  MemberIdentityCard,
} from "./member-identity-card";

export type {
  MemberIdentityCardProps,
} from "./member-identity-card";

export {
  MemberProfileCard,
} from "./member-profile-card";

export type {
  MemberProfileCardProps,
} from "./member-profile-card";

// -----------------------------------------------------------------------------
// Verification & Trust
// -----------------------------------------------------------------------------

export {
  MemberVerificationPanel,
} from "./member-verification-panel";

export type {
  MemberVerificationPanelProps,
} from "./member-verification-panel";

export {
  MemberTrustPanel,
} from "./member-trust-panel";

export type {
  MemberTrustPanelProps,
} from "./member-trust-panel";

// -----------------------------------------------------------------------------
// Roles & Security
// -----------------------------------------------------------------------------

export {
  MemberRolesPanel,
} from "./member-roles-panel";

export type {
  MemberRolesPanelProps,
} from "./member-roles-panel";

export {
  MemberRoleAssignmentDialog,
} from "./member-role-assignment-dialog";

export type {
  MemberRoleAssignmentDialogProps,
} from "./member-role-assignment-dialog";

export {
  MemberSecurityPanel,
} from "./member-security-panel";

export type {
  MemberSecurityPanelProps,
} from "./member-security-panel";

// -----------------------------------------------------------------------------
// Journeys & Bookings
// -----------------------------------------------------------------------------

export {
  MemberJourneyPanel,
} from "./member-journey-panel";

export type {
  MemberJourneyPanelProps,
} from "./member-journey-panel";

export {
  MemberBookingPanel,
} from "./member-booking-panel";

// -----------------------------------------------------------------------------
// Activity, Sessions & Devices
// -----------------------------------------------------------------------------

export {
  MemberActivityTimeline,
} from "./member-activity-timeline";

export {
  MemberSessionList,
} from "./member-session-list";

export {
  MemberDeviceList,
} from "./member-device-list";

// -----------------------------------------------------------------------------
// Member Actions & Dialogs
// -----------------------------------------------------------------------------

export {
  MemberContactChangeDialog,
} from "./member-contact-change-dialog";

export {
  MemberStatusChangeDialog,
} from "./member-status-change-dialog";
