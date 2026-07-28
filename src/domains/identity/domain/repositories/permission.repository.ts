// src/domains/authorization/domain/repositories/permission.repository.ts

import type { PermissionEntity } from '../entities/permission.entity';

import type { PermissionAction } from '../value-objects/permission-action.vo';
import type { PermissionCode } from '../value-objects/permission-code.vo';
import type { PermissionId } from '../value-objects/permission-id.vo';
import type { PermissionResource } from '../value-objects/permission-resource.vo';

export interface PermissionRepository {
  // --------------------------------------------------------------------------
  // Commands
  // --------------------------------------------------------------------------

  /**
   * Persists a new permission.
   */
  create(permission: PermissionEntity): Promise<void>;

  /**
   * Persists changes to an existing permission.
   */
  update(permission: PermissionEntity): Promise<void>;

  /**
   * Removes a permission.
   */
  delete(permissionId: PermissionId): Promise<void>;

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  /**
   * Finds a permission by its public identifier.
   */
  findById(permissionId: PermissionId): Promise<PermissionEntity | null>;

  /**
   * Finds a permission by its public identifier.
   */
  findByPublicId(publicId: PermissionId): Promise<PermissionEntity | null>;

  /**
   * Finds a permission by its unique code.
   */
  findByCode(code: PermissionCode): Promise<PermissionEntity | null>;

  /**
   * Finds a permission by its unique resource/action combination.
   */
  findByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionEntity | null>;

  /**
   * Returns whether the permission exists.
   */
  exists(permissionId: PermissionId): Promise<boolean>;

  /**
   * Returns whether a permission with the specified code exists.
   */
  existsByCode(code: PermissionCode): Promise<boolean>;

  /**
   * Returns whether the specified resource/action combination exists.
   */
  existsByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<boolean>;
}
