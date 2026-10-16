
/**
 * sisiMove — Admin Members Query Keys
 *
 * Centralized TanStack Query keys for the Admin Members feature.
 * Keep keys deterministic and scoped beneath the feature root so mutations
 * can invalidate related directory, count, detail, role, and activity data.
 */

import type { MemberDirectoryQueryDto } from "../types/member-api.types";

function normalizeDirectoryQuery(
  query: MemberDirectoryQueryDto = {},
): MemberDirectoryQueryDto {
  return {
    ...query,
    search: query.search?.trim() || undefined,
    // Preserve the narrow status union; status is not free-text input.
    status: query.status,
    rolePublicId: query.rolePublicId?.trim() || undefined,
    createdFrom: query.createdFrom?.trim() || undefined,
    createdTo: query.createdTo?.trim() || undefined,
  };
}

export const membersKeys = {
  all: ["admin", "members"] as const,

  // ---------------------------------------------------------------------------
  // Directory
  // ---------------------------------------------------------------------------

  directories: () => [...membersKeys.all, "directory"] as const,

  directory: (query: MemberDirectoryQueryDto = {}) =>
    [
      ...membersKeys.directories(),
      normalizeDirectoryQuery(query),
    ] as const,

  // ---------------------------------------------------------------------------
  // Counts
  // ---------------------------------------------------------------------------

  counts: () => [...membersKeys.all, "count"] as const,

  // ---------------------------------------------------------------------------
  // Member details
  // ---------------------------------------------------------------------------

  details: () => [...membersKeys.all, "detail"] as const,

  detail: (identityPublicId: string) =>
    [...membersKeys.details(), identityPublicId.trim()] as const,

  // ---------------------------------------------------------------------------
  // Member roles
  // ---------------------------------------------------------------------------

  roles: (identityPublicId: string) =>
    [
      ...membersKeys.all,
      "identity-roles",
      identityPublicId.trim(),
    ] as const,

  // ---------------------------------------------------------------------------
  // Member activity and related data
  // ---------------------------------------------------------------------------

  activity: (identityPublicId: string) =>
    [...membersKeys.all, "activity", identityPublicId.trim()] as const,

  verification: (identityPublicId: string) =>
    [...membersKeys.all, "verification", identityPublicId.trim()] as const,

  profile: (identityPublicId: string) =>
    [...membersKeys.all, "profile", identityPublicId.trim()] as const,

  trust: (identityPublicId: string) =>
    [...membersKeys.all, "trust", identityPublicId.trim()] as const,

  journeys: (identityPublicId: string) =>
    [...membersKeys.all, "journeys", identityPublicId.trim()] as const,

  bookings: (identityPublicId: string) =>
    [...membersKeys.all, "bookings", identityPublicId.trim()] as const,

  security: (identityPublicId: string) =>
    [...membersKeys.all, "security", identityPublicId.trim()] as const,

  authentication: (identityPublicId: string) =>
    [...membersKeys.all, "authentication", identityPublicId.trim()] as const,

  sessions: (identityPublicId: string) =>
    [...membersKeys.all, "sessions", identityPublicId.trim()] as const,

  devices: (identityPublicId: string) =>
    [...membersKeys.all, "devices", identityPublicId.trim()] as const,

  recovery: (identityPublicId: string) =>
    [...membersKeys.all, "recovery", identityPublicId.trim()] as const,
} as const;
