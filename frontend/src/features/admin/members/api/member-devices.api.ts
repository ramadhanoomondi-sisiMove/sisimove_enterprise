import { authenticatedApiClient } from "../../../authentication/http/authenticated-api-client";

/**
 * Transport representation of DeviceResponse.
 * Dates are strings because Date values are serialized as ISO-8601 JSON.
 * Device fingerprints are deliberately excluded from the response contract.
 */
export interface MemberDeviceResponse {
  publicId: string;
  identityPublicId: string;
  status: string;
  trustLevel: string;
  trustedAt?: string;
  name?: string;
  platform?: string;
  operatingSystem?: string;
  operatingSystemVersion?: string;
  browser?: string;
  browserVersion?: string;
  deviceType: string;
  lastSeenAt?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevokeMemberDeviceRequest {
  revokedAt: string;
  causationId?: string;
}

export interface TrustMemberDeviceRequest {
  trustedAt: string;
  causationId?: string;
}

/**
 * API adapter for Device security operations.
 *
 * Important scope limitation: the current GET /devices and GET /devices/active
 * controller actions derive identityPublicId from the authenticated principal.
 * They list the caller's devices, not an arbitrary selected member's devices.
 * Do not use these methods as an admin target-member lookup until the backend
 * provides and authorizes an identity-scoped administrative route.
 */
export const memberDevicesApi = {
  /** Lists devices belonging to the currently authenticated identity. */
  async listForCurrentIdentity(): Promise<MemberDeviceResponse[]> {
    return authenticatedApiClient.get<MemberDeviceResponse[]>("/devices");
  },

  /** Lists active devices belonging to the currently authenticated identity. */
  async listActiveForCurrentIdentity(): Promise<MemberDeviceResponse[]> {
    return authenticatedApiClient.get<MemberDeviceResponse[]>("/devices/active");
  },

  /** Retrieves a device by public ID; backend authorization/ownership applies. */
  async getByPublicId(
    devicePublicId: string,
  ): Promise<MemberDeviceResponse | null> {
    return authenticatedApiClient.get<MemberDeviceResponse | null>(
      `/devices/${encodeURIComponent(devicePublicId)}`,
    );
  },

  /** Revokes a device using the backend's required revokedAt field. */
  async revoke(
    devicePublicId: string,
    request: RevokeMemberDeviceRequest,
  ): Promise<MemberDeviceResponse> {
    return authenticatedApiClient.patch<MemberDeviceResponse>(
      `/devices/${encodeURIComponent(devicePublicId)}/revoke`,
      request,
    );
  },

  /** Marks a device as trusted; requires the backend device:trust permission. */
  async trust(
    devicePublicId: string,
    request: TrustMemberDeviceRequest,
  ): Promise<MemberDeviceResponse> {
    return authenticatedApiClient.patch<MemberDeviceResponse>(
      `/devices/${encodeURIComponent(devicePublicId)}/trust`,
      request,
    );
  },
};
