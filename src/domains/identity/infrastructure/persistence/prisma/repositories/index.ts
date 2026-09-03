// -----------------------------------------------------------------------------
// Identity — Prisma Repositories
// -----------------------------------------------------------------------------
//
// Infrastructure repository implementations for the Identity domain.
//
// These repositories implement the domain repository contracts while keeping
// Prisma-specific persistence concerns inside the infrastructure layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

export { PrismaIdentityRepository } from './prisma-identity.repository';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

export { default as PrismaVerificationRepository } from './prisma-verification.repository';

// -----------------------------------------------------------------------------
// Role
// -----------------------------------------------------------------------------

export { PrismaRoleRepository } from './prisma-role.repository';

// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------

export { default as PrismaPermissionRepository } from './prisma-permission.repository';

// -----------------------------------------------------------------------------
// Role Permission
// -----------------------------------------------------------------------------

export { default as PrismaRolePermissionRepository } from './prisma-role-permission.repository';
