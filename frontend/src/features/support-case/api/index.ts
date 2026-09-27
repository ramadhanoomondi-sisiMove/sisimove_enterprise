// -----------------------------------------------------------------------------
// sisiMove — Support API Exports
// -----------------------------------------------------------------------------
//
// Top-level public export boundary for the Support feature's HTTP adapters.
//
// Resource boundaries remain separated:
//
//     cases/
//     messages/
//     evidence/
//     resolution/
//
// This file only composes those boundaries. It does not:
//
// - define endpoints;
// - perform HTTP requests;
// - contain authorization logic;
// - contain mapping logic;
// - contain Support business rules.
//
// Consumers may therefore import Support API operations from:
//
//     @/features/support/api
//
// rather than depending on the internal resource directory structure.
// -----------------------------------------------------------------------------

export * from './cases';
