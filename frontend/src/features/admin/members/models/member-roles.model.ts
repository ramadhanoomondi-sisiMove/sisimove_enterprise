
/**
 * sisiMove — Admin Member Roles Model
 *
 * Represents role definitions and role assignments used by Members Management.
 *
 * Domain boundaries:
 * - Role owns role definitions.
 * - Identity owns identity-role assignments.
 * - RolePermission owns role-to-permission relationships.
 *
 * A role assignment is not itself a permission definition.
 * Frontend models do not establish authorization.
 *
 * Dates are strings because backend Date values are serialized to JSON.
 */

/**
 * Role definition returned by the Roles API.
 */
export interface MemberRoleDefinition {
  publicId: string;
  code: string;
  name: string;
  description?: string;

  displayOrder: number;
  isSystem: boolean;
  isActive: boolean;
  canBeAssigned: boolean;

  createdAt: string;
  updatedAt: string;
}

/**
 * Role assignment returned by the Identity API.
 */
export interface MemberRoleAssignment {
  publicId: string;
  identityPublicId: string;
  rolePublicId: string;

  assignedByPublicId?: string;
  assignedAt: string;
  expiresAt?: string;

  revokedAt?: string;
  revokedByPublicId?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Role assignment enriched with its role definition for display.
 *
 * The role definition may be unavailable if it has not been loaded.
 */
export interface MemberRoleAssignmentDetail {
  assignment: MemberRoleAssignment;
  role?: MemberRoleDefinition;
}

/**
 * Role-related data for one member's administrative detail view.
 */
export interface MemberRolesOverview {
  identityPublicId: string;
  assignments: MemberRoleAssignmentDetail[];
}

/**
 * Filters supported by the existing Roles controller.
 */
export interface MemberRoleFilters {
  isActive?: boolean;
  isSystem?: boolean;
  assignable?: boolean;
  orderByDisplayOrder?: boolean;
}
