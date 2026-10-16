import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type { IdentityRoleResponseDto } from "../types/member-api.types";

/**
 * Request body accepted by POST /identities/:identityPublicId/roles.
 *
 * The backend assigns the role to the target Identity. The actor/assigner is
 * derived from the authenticated security context, not supplied by the client.
 */
export interface AssignMemberRoleRequest {
  rolePublicId: string;
  expiresAt?: string;
}

/**
 * Request body accepted by PATCH
 * /identities/:identityPublicId/roles/:rolePublicId/revoke.
 */
export interface RevokeMemberRoleRequest {
  reason: string;
}

/**
 * Identity role-assignment API operations used by the admin members feature.
 *
 * These methods operate on role assignments attached to an Identity. They do
 * not manage Role definitions or RolePermission relationships.
 *
 * Backend permissions:
 * - list assignments: identity-role:read
 * - assign a role: identity-role:assign
 * - revoke a role: identity-role:revoke
 */
export const memberRolesApi = {
  /**
   * List role assignments for an Identity.
   * GET /identities/:identityPublicId/roles
   */
  getForIdentity(
    identityPublicId: string,
  ): Promise<IdentityRoleResponseDto[]> {
    const id = encodeURIComponent(identityPublicId);

    return authenticatedApiClient.get<IdentityRoleResponseDto[]>(
      `/identities/${id}/roles`,
    );
  },

  /**
   * Assign an existing Role to an Identity.
   * POST /identities/:identityPublicId/roles
   */
  assign(
    identityPublicId: string,
    request: AssignMemberRoleRequest,
  ): Promise<IdentityRoleResponseDto> {
    const id = encodeURIComponent(identityPublicId);

    return authenticatedApiClient.post<IdentityRoleResponseDto>(
      `/identities/${id}/roles`,
      request,
    );
  },

  /**
   * Revoke a role assignment from an Identity.
   * PATCH /identities/:identityPublicId/roles/:rolePublicId/revoke
   *
   * The rolePublicId identifies the role being revoked, not the role-assignment
   * public ID. The backend records the authenticated actor as the revoker.
   */
  revoke(
    identityPublicId: string,
    rolePublicId: string,
    request: RevokeMemberRoleRequest,
  ): Promise<IdentityRoleResponseDto> {
    const id = encodeURIComponent(identityPublicId);
    const roleId = encodeURIComponent(rolePublicId);

    return authenticatedApiClient.patch<IdentityRoleResponseDto>(
      `/identities/${id}/roles/${roleId}/revoke`,
      request,
    );
  },
};

export default memberRolesApi;
