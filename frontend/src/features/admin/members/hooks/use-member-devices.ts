"use client";

import { useQuery } from "@tanstack/react-query";

import { memberDevicesApi } from "../api/member-devices.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Member Devices Hook
 *
 * Loads devices for the currently authenticated identity only.
 * The current backend GET /devices endpoint is caller-scoped; it must not be
 * used to display devices for an arbitrary member in the Admin Members view.
 * Add an authorized identity-scoped backend route before implementing that
 * administrative lookup.
 */
export function useMemberDevices() {
  return useQuery({
    queryKey: membersKeys.devices("current-identity"),
    queryFn: () => memberDevicesApi.listForCurrentIdentity(),
  });
}

/** Loads active devices for the currently authenticated identity only. */
export function useActiveMemberDevices() {
  return useQuery({
    queryKey: [...membersKeys.devices("current-identity"), "active"] as const,
    queryFn: () => memberDevicesApi.listActiveForCurrentIdentity(),
  });
}

export default useMemberDevices;
