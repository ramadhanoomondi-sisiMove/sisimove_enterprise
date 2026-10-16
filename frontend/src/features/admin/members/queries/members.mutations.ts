
/**
 * sisiMove — Admin Members Mutation Options
 *
 * Mutations delegate transport to the existing API adapters. Successful
 * identity changes invalidate the directory, aggregate count, and affected
 * member detail so the UI can refresh from backend-authoritative state.
 *
 * Role assignment and revocation also invalidate the affected member's role
 * queries. Lifecycle, role, and permission rules remain enforced by the
 * backend.
 */

import {
  mutationOptions,
  type QueryClient,
} from "@tanstack/react-query";

import { memberIdentityApi } from "../api/member-identity.api";
import { memberRolesApi } from "../api/member-roles.api";
import { membersKeys } from "./members.keys";

import type {
  ChangeMemberEmailRequestDto,
  ChangeMemberPhoneNumberRequestDto,
} from "../api/member-identity.api";

import type {
  AssignMemberRoleRequest,
  RevokeMemberRoleRequest,
} from "../api/member-roles.api";

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface MemberIdentityMutationVariables {
  identityPublicId: string;
}

export interface ChangeMemberEmailVariables
  extends MemberIdentityMutationVariables {
  body: ChangeMemberEmailRequestDto;
}

export interface ChangeMemberPhoneNumberVariables
  extends MemberIdentityMutationVariables {
  body: ChangeMemberPhoneNumberRequestDto;
}

export interface AssignMemberRoleVariables
  extends MemberIdentityMutationVariables {
  body: AssignMemberRoleRequest;
}

export interface RevokeMemberRoleVariables
  extends MemberIdentityMutationVariables {
  rolePublicId: string;
  body: RevokeMemberRoleRequest;
}

// -----------------------------------------------------------------------------
// Query Invalidation
// -----------------------------------------------------------------------------

async function invalidateMemberIdentityQueries(
  queryClient: QueryClient,
  identityPublicId: string,
): Promise<void> {
  const normalizedIdentityPublicId = identityPublicId.trim();

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: membersKeys.directories(),
    }),

    queryClient.invalidateQueries({
      queryKey: membersKeys.counts(),
    }),

    queryClient.invalidateQueries({
      queryKey: membersKeys.detail(normalizedIdentityPublicId),
    }),
  ]);
}

async function invalidateMemberRoleQueries(
  queryClient: QueryClient,
  identityPublicId: string,
): Promise<void> {
  const normalizedIdentityPublicId = identityPublicId.trim();

  await Promise.all([
    invalidateMemberIdentityQueries(
      queryClient,
      normalizedIdentityPublicId,
    ),

    queryClient.invalidateQueries({
      queryKey: membersKeys.roles(normalizedIdentityPublicId),
    }),
  ]);
}

// -----------------------------------------------------------------------------
// Mutation Options
// -----------------------------------------------------------------------------

export const membersMutations = {
  // ---------------------------------------------------------------------------
  // Identity Lifecycle
  // ---------------------------------------------------------------------------

  activate: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
      }: MemberIdentityMutationVariables) =>
        memberIdentityApi.activate(identityPublicId),

      onSuccess: async (_result, variables) => {
        await invalidateMemberIdentityQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),

  suspend: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
      }: MemberIdentityMutationVariables) =>
        memberIdentityApi.suspend(identityPublicId),

      onSuccess: async (_result, variables) => {
        await invalidateMemberIdentityQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),

  close: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
      }: MemberIdentityMutationVariables) =>
        memberIdentityApi.close(identityPublicId),

      onSuccess: async (_result, variables) => {
        await invalidateMemberIdentityQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),

  // ---------------------------------------------------------------------------
  // Contact Details
  // ---------------------------------------------------------------------------

  changeEmail: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
        body,
      }: ChangeMemberEmailVariables) =>
        memberIdentityApi.changeEmail(identityPublicId, body),

      onSuccess: async (_result, variables) => {
        await invalidateMemberIdentityQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),

  changePhoneNumber: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
        body,
      }: ChangeMemberPhoneNumberVariables) =>
        memberIdentityApi.changePhoneNumber(identityPublicId, body),

      onSuccess: async (_result, variables) => {
        await invalidateMemberIdentityQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),

  // ---------------------------------------------------------------------------
  // Member Role Assignments
  // ---------------------------------------------------------------------------

  assignRole: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
        body,
      }: AssignMemberRoleVariables) =>
        memberRolesApi.assign(identityPublicId, body),

      onSuccess: async (_result, variables) => {
        await invalidateMemberRoleQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),

  revokeRole: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({
        identityPublicId,
        rolePublicId,
        body,
      }: RevokeMemberRoleVariables) =>
        memberRolesApi.revoke(
          identityPublicId,
          rolePublicId,
          body,
        ),

      onSuccess: async (_result, variables) => {
        await invalidateMemberRoleQueries(
          queryClient,
          variables.identityPublicId,
        );
      },
    }),
};
