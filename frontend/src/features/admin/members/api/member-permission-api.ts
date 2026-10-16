import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * sisiMove — Admin Member Permission API
 *
 * Reads the permission definitions, role-permission relationships, and roles
 * assigned to a specific identity using routes present in the supplied
 * backend controllers/contracts.
 *
 * Important: these resources do not, by themselves, prove the current user's
 * effective permissions. Backend guards remain the authorization boundary.
 */

export interface MemberPermissionDefinitionResponse {
  publicId: string;
  code: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  canBeAssigned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRolePermissionResponse {
  /** Public ID of the role-permission relationship. */
  publicId: string;
  rolePublicId: string;
  permissionPublicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRoleResponse {
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

export const memberPermissionApi = {
  /**
   * Lists permission definitions.
   * Backend: GET /permissions
   * Permission required by backend: permission:read
   */
  async listDefinitions(
    options: RequestOptions = {},
  ): Promise<MemberPermissionDefinitionResponse[]> {
    return authenticatedApiClient.get<MemberPermissionDefinitionResponse[]>(
      "/permissions",
      options,
    );
  },

  /**
   * Lists role-permission relationships.
   * Backend: GET /role-permissions
   * Permission required by backend: role-permission:read
   */
  async listRolePermissionAssignments(
    options: RequestOptions = {},
  ): Promise<MemberRolePermissionResponse[]> {
    return authenticatedApiClient.get<MemberRolePermissionResponse[]>(
      "/role-permissions",
      options,
    );
  },

  /**
   * Lists roles assigned to the selected identity.
   * Backend: GET /identities/:identityPublicId/roles
   * Permission required by backend: identity-role:read
   *
   * The exact response DTO for this endpoint was not included in the supplied
   * source, so the result remains unknown[] rather than inventing a contract.
   */
  async listRolesForIdentity(
    identityPublicId: string,
    options: RequestOptions = {},
  ): Promise<unknown[]> {
    const id = encodeURIComponent(identityPublicId.trim());

    if (!id) {
      return [];
    }

    return authenticatedApiClient.get<unknown[]>(
      `/identities/${id}/roles`,
      options,
    );
  },
};

export default memberPermissionApi;
