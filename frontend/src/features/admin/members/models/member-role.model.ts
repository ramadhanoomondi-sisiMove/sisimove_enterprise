
/**
 * sisiMove — Member Role Model
 *
 * Represents role definitions used by the administrative Members feature.
 *
 * Domain boundaries:
 * - Role owns role definitions.
 * - Identity owns assignments of roles to identities.
 * - RolePermission owns relationships between roles and permissions.
 *
 * This frontend model does not grant permissions or establish authorization.
 */

export interface MemberRole {
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
 * Compact role projection for member directory rows.
 */
export interface MemberRoleSummary {
  publicId: string;
  code: string;
  name: string;
}

/**
 * Supported role filters based on the existing Roles controller.
 */
export interface MemberRoleFilters {
  isActive?: boolean;
  isSystem?: boolean;
  assignable?: boolean;
  orderByDisplayOrder?: boolean;
}
