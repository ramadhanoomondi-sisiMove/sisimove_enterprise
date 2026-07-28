// src/domains/authorization/domain/repositories/identity-role.repository.ts

import type { IdentityRoleEntity } from '../entities/identity-role.entity';

import type { IdentityId } from '../../../identity/domain/value-objects/identity-id.vo';

import type { RoleId } from '../value-objects/role-id.vo';

export interface IdentityRoleRepository {
  create(identityRole: IdentityRoleEntity): Promise<void>;

  update(identityRole: IdentityRoleEntity): Promise<void>;

  delete(identityId: IdentityId, roleId: RoleId): Promise<void>;

  findByIdentityAndRole(
    identityId: IdentityId,
    roleId: RoleId,
  ): Promise<IdentityRoleEntity | null>;

  findByIdentity(
    identityId: IdentityId,
  ): Promise<readonly IdentityRoleEntity[]>;

  findByRole(roleId: RoleId): Promise<readonly IdentityRoleEntity[]>;

  exists(identityId: IdentityId, roleId: RoleId): Promise<boolean>;
}
