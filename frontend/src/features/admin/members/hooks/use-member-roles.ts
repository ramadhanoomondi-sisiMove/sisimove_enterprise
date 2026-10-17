
/**
 * sisiMove — Admin Member Roles Hook
 *
 * Provides role-assignment data and mutations for a single member.
 * Query definitions and cache invalidation remain centralized in the
 * Admin Members query-options layer.
 */

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  membersMutations,
  type AssignMemberRoleVariables,
  type RevokeMemberRoleVariables,
} from "../queries/members.mutations";
import { membersQueries } from "../queries/members.queries";

// -----------------------------------------------------------------------------
// Role Assignments Query
// -----------------------------------------------------------------------------

export function useMemberRoles(identityPublicId: string) {
  const normalizedIdentityPublicId = identityPublicId.trim();

  return useQuery(
    membersQueries.roles(normalizedIdentityPublicId),
  );
}

// -----------------------------------------------------------------------------
// Role Assignment Mutation
// -----------------------------------------------------------------------------

export function useAssignMemberRole() {
  const queryClient = useQueryClient();

  return useMutation(
    membersMutations.assignRole(queryClient),
  );
}

// -----------------------------------------------------------------------------
// Role Revocation Mutation
// -----------------------------------------------------------------------------

export function useRevokeMemberRole() {
  const queryClient = useQueryClient();

  return useMutation(
    membersMutations.revokeRole(queryClient),
  );
}

// -----------------------------------------------------------------------------
// Combined Hook
// -----------------------------------------------------------------------------

export interface UseMemberRolesOptions {
  identityPublicId: string;
}

export function useMemberRolesManager({
  identityPublicId,
}: UseMemberRolesOptions) {
  const normalizedIdentityPublicId = identityPublicId.trim();

  const rolesQuery = useMemberRoles(normalizedIdentityPublicId);
  const assignRoleMutation = useAssignMemberRole();
  const revokeRoleMutation = useRevokeMemberRole();

  return {
    // Query state
    assignments: rolesQuery.data ?? [],
    isLoading: rolesQuery.isPending && !rolesQuery.data,
    isFetching: rolesQuery.isFetching,
    error: rolesQuery.error,
    isError: rolesQuery.isError,
    refetch: rolesQuery.refetch,

    // Assignment mutation state
    assignRole: (body: AssignMemberRoleVariables["body"]) =>
      assignRoleMutation.mutateAsync({
        identityPublicId: normalizedIdentityPublicId,
        body,
      }),
    isAssigning: assignRoleMutation.isPending,
    assignError: assignRoleMutation.error,
    assignIsError: assignRoleMutation.isError,

    // Revocation mutation state
    revokeRole: (
      rolePublicId: string,
      body: RevokeMemberRoleVariables["body"],
    ) =>
      revokeRoleMutation.mutateAsync({
        identityPublicId: normalizedIdentityPublicId,
        rolePublicId,
        body,
      }),
    isRevoking: revokeRoleMutation.isPending,
    revokeError: revokeRoleMutation.error,
    revokeIsError: revokeRoleMutation.isError,

    // Mutation results
    assignResult: assignRoleMutation.data,
    revokeResult: revokeRoleMutation.data,
  };
}
