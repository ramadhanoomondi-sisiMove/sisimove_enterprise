// -----------------------------------------------------------------------------
// Identity Domain Repositories
// -----------------------------------------------------------------------------
//
// Repository contracts for Identity-domain aggregate persistence.
//
// Repository boundaries:
//
// - IdentityAggregate
// - VerificationAggregate
// - RoleAggregate
// - PermissionAggregate
// - RolePermissionAggregate
//
// Repository interfaces belong to the domain layer and must remain independent
// of persistence technologies such as Prisma, SQL, MongoDB, or ORM models.
//
// Infrastructure implementations provide the concrete persistence behavior.
//
// -----------------------------------------------------------------------------
//
// Aggregate ownership:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// RoleAggregate
// └── RoleEntity
//
// PermissionAggregate
// └── PermissionEntity
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// Aggregate-owned child entities are persisted through their aggregate
// repository. They must not expose independent repository boundaries unless
// they are promoted to an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// Repository contracts expose domain public-identity value objects rather than
// persistence identifiers.
//
// Infrastructure implementations are responsible for translating these
// identities into persistence-specific identifiers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity Aggregate
// -----------------------------------------------------------------------------

export type { IdentityRepository } from './identity.repository';

// -----------------------------------------------------------------------------
// Verification Aggregate
// -----------------------------------------------------------------------------

export type { VerificationRepository } from './verification.repository';

// -----------------------------------------------------------------------------
// Role Aggregate
// -----------------------------------------------------------------------------

export type { RoleRepository } from './role.repository';

// -----------------------------------------------------------------------------
// Permission Aggregate
// -----------------------------------------------------------------------------

export type { PermissionRepository } from './permission.repository';

// -----------------------------------------------------------------------------
// Role Permission Aggregate
// -----------------------------------------------------------------------------

export type { RolePermissionRepository } from './role-permission.repository';
