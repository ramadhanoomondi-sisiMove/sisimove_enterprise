
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { memberPermissionApi } from "../api/member-permission-api";
import { memberActionPolicy } from "../permissions/member-action-policy";

/**
 * sisiMove — Admin Member Permissions Hook
 *
 * Loads permission definitions and the selected identity's role assignments.
 * UI actions are evaluated against permission codes supplied by the
 * application's authenticated authorization state.
 *
 * Permission-definition and role-assignment reads do not establish the
 * current user's effective grants. Backend authorization remains authoritative.
 */
export function useMemberPermissions(
  identityPublicId: string,
  grantedPermissions: readonly string[] = [],
) {
  const normalizedIdentityPublicId = identityPublicId.trim();

  const definitionsQuery = useQuery({
    queryKey: ["admin", "members", "permission-definitions"],
    queryFn: () => memberPermissionApi.listDefinitions(),
  });

  const rolePermissionAssignmentsQuery = useQuery({
    queryKey: ["admin", "members", "role-permission-assignments"],
    queryFn: () =>
      memberPermissionApi.listRolePermissionAssignments(),
  });

  const memberRolesQuery = useQuery({
    queryKey: [
      "admin",
      "members",
      "identity-roles",
      normalizedIdentityPublicId,
    ],
    queryFn: () =>
      memberPermissionApi.listRolesForIdentity(
        normalizedIdentityPublicId,
      ),
    enabled: normalizedIdentityPublicId.length > 0,
  });

  const actionPermissions = useMemo(() => {
    const canRead = memberActionPolicy.canRead(grantedPermissions);
    const canActivate =
      memberActionPolicy.canActivate(grantedPermissions);
    const canSuspend =
      memberActionPolicy.canSuspend(grantedPermissions);
    const canClose = memberActionPolicy.canClose(grantedPermissions);
    const canChangeEmail =
      memberActionPolicy.canChangeEmail(grantedPermissions);
    const canChangePhoneNumber =
      memberActionPolicy.canChangePhoneNumber(grantedPermissions);

    const canReadRoles =
      memberActionPolicy.canReadRoles(grantedPermissions);
    const canAssignRole =
      memberActionPolicy.canAssignRole(grantedPermissions);
    const canRevokeRole =
      memberActionPolicy.canRevokeRole(grantedPermissions);

    return {
      canRead,
      canActivate,
      canSuspend,
      canClose,
      canChangeEmail,
      canChangePhoneNumber,
      canReadRoles,
      canAssignRole,
      canRevokeRole,

      canPerform: (
        action:
          | "canRead"
          | "canActivate"
          | "canSuspend"
          | "canClose"
          | "canChangeEmail"
          | "canChangePhoneNumber"
          | "canReadRoles"
          | "canAssignRole"
          | "canRevokeRole",
      ): boolean => {
        switch (action) {
          case "canRead":
            return canRead;
          case "canActivate":
            return canActivate;
          case "canSuspend":
            return canSuspend;
          case "canClose":
            return canClose;
          case "canChangeEmail":
            return canChangeEmail;
          case "canChangePhoneNumber":
            return canChangePhoneNumber;
          case "canReadRoles":
            return canReadRoles;
          case "canAssignRole":
            return canAssignRole;
          case "canRevokeRole":
            return canRevokeRole;
        }
      },
    };
  }, [grantedPermissions]);

  return {
    ...actionPermissions,

    definitions: definitionsQuery.data ?? [],
    definitionsQuery,

    rolePermissionAssignments:
      rolePermissionAssignmentsQuery.data ?? [],
    rolePermissionAssignmentsQuery,

    memberRoles: memberRolesQuery.data ?? [],
    memberRolesQuery,
  };
}

export default useMemberPermissions;
