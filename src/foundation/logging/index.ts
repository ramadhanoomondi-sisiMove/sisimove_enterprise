// =============================================================================
// Foundation — Logging — Index
// =============================================================================
//
// Central barrel export for the foundation logging infrastructure.
//
// Exposes:
//
// - CorrelationId
// - LogContext
// - LogLevel
// - Logger
// - LOGGER
//
// Implementations of Logger belong to the infrastructure layer.
// Application and domain code should depend only on the Logger abstraction.
//

// -----------------------------------------------------------------------------
// Correlation
// -----------------------------------------------------------------------------

export { CorrelationId } from './correlation-id';

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

export type { LogContext } from './log-context';

// -----------------------------------------------------------------------------
// Level
// -----------------------------------------------------------------------------

export { LogLevel } from './log-level.enum';

// -----------------------------------------------------------------------------
// Logger
// -----------------------------------------------------------------------------

export type { Logger } from './logger.interface';

// -----------------------------------------------------------------------------
// Dependency Injection Token
// -----------------------------------------------------------------------------

export { LOGGER } from './logger.token';
