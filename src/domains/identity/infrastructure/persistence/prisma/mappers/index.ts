// -----------------------------------------------------------------------------
// Identity — Prisma Mappers
// -----------------------------------------------------------------------------
//
// Barrel exports for Identity domain Prisma mappers.
//
// Mappers:
//
// - IdentityPrismaMapper
// - VerificationPrismaMapper
// - RolePrismaMapper
// - PermissionPrismaMapper
// - RolePermissionPrismaMapper
//
// Each mapper is responsible for translating between Prisma persistence
// structures and its corresponding domain aggregate/entity boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

export * from './identity-prisma.mapper';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

export * from './verification-prisma.mapper';

// -----------------------------------------------------------------------------
// Role
// -----------------------------------------------------------------------------

export * from './role-prisma.mapper';

// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------

export * from './permission-prisma.mapper';

// -----------------------------------------------------------------------------
// Role Permission
// -----------------------------------------------------------------------------

export * from './role-permission-prisma.mapper';
