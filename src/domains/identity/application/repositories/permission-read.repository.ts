import type { PermissionResponse } from '../responses/permission.response';

export interface PermissionReadRepository {
  /**
   * Finds a permission by its internal identifier.
   */
  findById(id: string): Promise<PermissionResponse | null>;

  /**
   * Finds a permission by its public identifier.
   */
  findByPublicId(publicId: string): Promise<PermissionResponse | null>;

  /**
   * Returns all permissions.
   */
  findAll(includeInactive?: boolean): Promise<PermissionResponse[]>;
}
