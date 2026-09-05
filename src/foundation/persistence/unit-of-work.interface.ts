// -----------------------------------------------------------------------------
// Foundation — Unit of Work Interface
// -----------------------------------------------------------------------------
//
// Defines the application-level transaction boundary.
//
// Responsibilities:
//
// - execute application work atomically;
// - commit when the operation succeeds;
// - rollback when the operation fails.
//
// This interface contains NO:
// - Prisma;
// - database-specific APIs;
// - domain logic;
// - repository implementations;
// - event-bus implementation.
//
// Infrastructure provides the concrete implementation.
//
// -----------------------------------------------------------------------------
//
// Architectural rule:
//
// The UnitOfWork defines WHEN work is transactional.
//
// It does not define WHICH repositories exist.
//
// Repositories remain separate application/domain ports and are injected
// normally into application handlers.
//
// This prevents UnitOfWork from becoming a service locator or a giant
// repository container.
//
// -----------------------------------------------------------------------------

export interface UnitOfWork {
  execute<T>(work: () => Promise<T>): Promise<T>;
}
