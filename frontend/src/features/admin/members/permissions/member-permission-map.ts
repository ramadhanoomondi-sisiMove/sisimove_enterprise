
/**
 * sisiMove — Admin Member Permission Map
 *
 * Maps member actions to the backend permission codes required for them.
 * These codes must match the permissions configured by the backend.
 */
export const memberPermissionMap = {
  read: "identity:read",
  activate: "identity:activate",
  suspend: "identity:suspend",
  close: "identity:close",
  changeEmail: "identity:change-email",
  changePhoneNumber: "identity:change-phone-number",
  readRoles: "identity-role:read",
  assignRole: "identity-role:assign",
  revokeRole: "identity-role:revoke",
} as const;

export type MemberActionPermission =
  (typeof memberPermissionMap)[keyof typeof memberPermissionMap];
