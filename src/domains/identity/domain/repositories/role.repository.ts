// src/domains/authorization/domain/repositories/role.repository.ts

import type { RoleAggregate } from '../aggregates/role.aggregate';
import type { RoleCode } from '../value-objects/role-code.vo';
import type { RoleId } from '../value-objects/role-id.vo';
import type { RoleName } from '../value-objects/role-name.vo';

export interface RoleRepository {
  /**
   * Persists a new role.
   */
  create(role: RoleAggregate): Promise<void>;

  /**
   * Persists changes to an existing role.
   */
  update(role: RoleAggregate): Promise<void>;

  /**
   * Removes a role.
   */
  delete(roleId: RoleId): Promise<void>;

  /**
   * Finds a role by its internal identifier.
   */
  findById(roleId: RoleId): Promise<RoleAggregate | null>;

  /**
   * Finds a role by its public identifier.
   */
  findByPublicId(publicId: RoleId): Promise<RoleAggregate | null>;

  /**
   * Finds a role by its unique name.
   */
  findByName(name: RoleName): Promise<RoleAggregate | null>;

  /**
   * Finds a role by its unique code.
   */
  findByCode(code: RoleCode): Promise<RoleAggregate | null>;

  /**
   * Returns whether the role exists.
   */
  exists(roleId: RoleId): Promise<boolean>;

  /**
   * Returns whether a role with the specified name exists.
   */
  existsByName(name: RoleName): Promise<boolean>;

  /**
   * Returns whether a role with the specified code exists.
   */
  existsByCode(code: RoleCode): Promise<boolean>;
}
