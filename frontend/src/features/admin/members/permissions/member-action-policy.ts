
import {
  memberPermissionMap,
  type MemberActionPermission,
} from "./member-permission-map";

/**
 * Evaluates whether the supplied permission codes allow a member action.
 *
 * This is a frontend visibility helper only. The backend remains responsible
 * for enforcing authorization on every request.
 */
export const memberActionPolicy = {
  hasPermission(
    grantedPermissions: readonly string[],
    requiredPermission: MemberActionPermission,
  ): boolean {
    return grantedPermissions.includes(requiredPermission);
  },

  canRead(
    grantedPermissions: readonly string[],
  ): boolean {
    return this.hasPermission(
      grantedPermissions,
      memberPermissionMap.read,
    );
  },

  canActivate(
    grantedPermissions: readonly string[],
  ): boolean {
    return this.hasPermission(
      grantedPermissions,
      memberPermissionMap.activate,
    );
  },

  canSuspend(
    grantedPermissions: readonly string[],
  ): boolean {
    return this.hasPermission(
      grantedPermissions,
      memberPermissionMap.suspend,
    );
  },

  canClose(
    grantedPermissions: readonly string[],
  ): boolean {
    return this.hasPermission(
      grantedPermissions,
      memberPermissionMap.close,
    );
  },

  canChangeEmail(
    grantedPermissions: readonly string[],
  ): boolean {
    return this.hasPermission(
      grantedPermissions,
      memberPermissionMap.changeEmail,
    );
  },

  canChangePhoneNumber(
    grantedPermissions: readonly string[],
  ): boolean {
    return this.hasPermission(
      grantedPermissions,
      memberPermissionMap.changePhoneNumber,
    );
  },
};
