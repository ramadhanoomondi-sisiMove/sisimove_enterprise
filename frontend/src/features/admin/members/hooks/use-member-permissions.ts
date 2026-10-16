"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { memberPermissionApi } from "../api/member-permission-api";
import { memberPermissionMap } from "../permissions/member-permission-map";
import { memberActionPolicy } from "../permissions/member-action-policy";

/**
 * sisiMove — Admin Member Permissions Hook
 *
 * Loads permission definitions and the selected identity's role assignments.
 * UI actions are evaluated separately against permission codes supplied by the
 * application's authenticated authorization state. These API reads do not
 * establish the current user's effective grants; backend guards remain the
 * authoritative security boundary.
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
    queryFn: () => memberPermissionApi.listRolePermissionAssignments(),
  });

  const memberRolesQuery = useQuery({
    queryKey: ["admin", "members", "identity-roles", normalizedIdentityPublicId],
    queryFn: () =>
      memberPermissionApi.listRolesForIdentity(normalizedIdentityPublicId),
    enabled: normalizedIdentityPublicId.length > 0,
  });

  const actionPermissions = useMemo(() => {
    const granted = new Set(grantedPermissions);

    return {
      canRead: granted.has(memberPermissionMap.read),
      canActivate: granted.has(memberPermissionMap.activate),
      canSuspend: granted.has(memberPermissionMap.suspend),
      canClose: granted.has(memberPermissionMap.close),
      canChangeEmail: granted.has(memberPermissionMap.changeEmail),
      canChangePhoneNumber: granted.has(memberPermissionMap.changePhoneNumber),
      canPerform: (
        action: "canRead" | "canActivate" | "canSuspend" | "canClose" | "canChangeEmail" | "canChangePhoneNumber",
      ): boolean => memberActionPolicy[action](grantedPermissions),
    };
  }, [grantedPermissions]);

  return {
    ...actionPermissions,
    definitions: definitionsQuery.data ?? [],
    definitionsQuery,
    rolePermissionAssignments: rolePermissionAssignmentsQuery.data ?? [],
    rolePermissionAssignmentsQuery,
    memberRoles: memberRolesQuery.data ?? [],
    memberRolesQuery,
  };
}

export default useMemberPermissions;
