// -----------------------------------------------------------------------------
// sisiMove — Support Mapper Exports
// -----------------------------------------------------------------------------
//
// Public export boundary for Support transport-to-application mappers.
//
// Mappers are deliberately separate from API adapters:
//
//     api/       → HTTP transport
//     mappers/   → transport → frontend model
//     models/    → frontend application representation
//
// No mapper performs HTTP requests or domain operations.
// -----------------------------------------------------------------------------

export * from './support-case.mapper';
export * from './support-case-message.mapper';
export * from './support-case-evidence.mapper';
export * from './support-case-resolution.mapper';
export * from './support-case-participant.mapper';