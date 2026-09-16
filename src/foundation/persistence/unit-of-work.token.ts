// -----------------------------------------------------------------------------
// Foundation — Unit of Work DI Token
// -----------------------------------------------------------------------------
//
// Runtime dependency-injection token for the UnitOfWork application port.
//
// The UnitOfWork interface disappears at runtime because it is a TypeScript
// type. NestJS therefore requires a runtime token to resolve the dependency.
//
// Application handlers depend on this token + UnitOfWork interface.
// Infrastructure binds the token to PrismaUnitOfWork.
//
// -----------------------------------------------------------------------------

export const UNIT_OF_WORK = Symbol('UnitOfWork');

export default UNIT_OF_WORK;
