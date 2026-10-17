
/**
 * sisiMove — Admin Verification Query Keys
 *
 * Centralized TanStack Query keys for the admin verification feature.
 *
 * Keep key construction deterministic so related queries can be
 * invalidated consistently after verification actions.
 */

const normalizeId = (value: string): string => value.trim();

export const verificationsKeys = {
  all: ["admin", "verifications"] as const,

  counts: () => [...verificationsKeys.all, "counts"] as const,

  details: () => [...verificationsKeys.all, "detail"] as const,

  detail: (verificationPublicId: string) =>
    [
      ...verificationsKeys.details(),
      normalizeId(verificationPublicId),
    ] as const,

  byIdentity: () => [...verificationsKeys.all, "by-identity"] as const,

  byIdentityPublicId: (identityPublicId: string) =>
    [
      ...verificationsKeys.byIdentity(),
      normalizeId(identityPublicId),
    ] as const,

  requests: (verificationPublicId: string) =>
    [
      ...verificationsKeys.detail(verificationPublicId),
      "requests",
    ] as const,

  request: (
    verificationPublicId: string,
    verificationRequestPublicId: string,
  ) =>
    [
      ...verificationsKeys.requests(verificationPublicId),
      normalizeId(verificationRequestPublicId),
    ] as const,

  evidence: (
    verificationPublicId: string,
    verificationRequestPublicId: string,
  ) =>
    [
      ...verificationsKeys.request(
        verificationPublicId,
        verificationRequestPublicId,
      ),
      "evidence",
    ] as const,
} as const;

export default verificationsKeys;
