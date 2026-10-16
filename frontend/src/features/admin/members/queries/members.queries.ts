
/**
 * sisiMove — Admin Members Query Options
 *
 * Query definitions are kept separate from React components and hooks.
 * Hooks can consume these options with useQuery, while server-side or
 * prefetching workflows can reuse the same keys and query functions.
 */

import { queryOptions } from "@tanstack/react-query";

import { membersApi } from "../api/members.api";
import { memberIdentityApi } from "../api/member-identity.api";
import { memberRolesApi } from "../api/member-roles.api";
import { membersKeys } from "./members.keys";

import type { MemberDirectoryQueryDto } from "../types/member-api.types";

export const membersQueries = {
  // ---------------------------------------------------------------------------
  // Directory
  // ---------------------------------------------------------------------------

  directory: (query: MemberDirectoryQueryDto = {}) =>
    queryOptions({
      queryKey: membersKeys.directory(query),
      queryFn: () => membersApi.list(query),
    }),

  // ---------------------------------------------------------------------------
  // Counts
  // ---------------------------------------------------------------------------

  count: () =>
    queryOptions({
      queryKey: membersKeys.counts(),
      queryFn: () => membersApi.count(),
    }),

  // ---------------------------------------------------------------------------
  // Member identity
  // ---------------------------------------------------------------------------

  detail: (identityPublicId: string) =>
    queryOptions({
      queryKey: membersKeys.detail(identityPublicId),
      queryFn: () => memberIdentityApi.getByPublicId(identityPublicId),
      enabled: identityPublicId.trim().length > 0,
    }),

  // ---------------------------------------------------------------------------
  // Member role assignments
  // ---------------------------------------------------------------------------

  roles: (identityPublicId: string) =>
    queryOptions({
      queryKey: membersKeys.roles(identityPublicId),
      queryFn: () =>
        memberRolesApi.getForIdentity(identityPublicId.trim()),
      enabled: identityPublicId.trim().length > 0,
    }),
};

export { membersKeys };
