import type { RoleResponse } from '../responses/role.response';

export interface RoleReadRepository {
  /**
   * Finds a role by its internal identifier.
   */
  findById(id: string): Promise<RoleResponse | null>;

  /**
   * Finds a role by its public identifier.
   */
  findByPublicId(publicId: string): Promise<RoleResponse | null>;

  /**
   * Returns all roles.
   */
  findAll(includeInactive?: boolean): Promise<RoleResponse[]>;
}
