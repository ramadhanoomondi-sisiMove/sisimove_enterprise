// -----------------------------------------------------------------------------
// sisiMove — Support Case Resolution API Exports
// -----------------------------------------------------------------------------
//
// Public export boundary for member-facing Support Case resolution APIs.
//
// Resolution creation is intentionally NOT exported here.
//
// The backend exposes resolution creation as an internal/support operation
// requiring `support-case:resolve` and an explicit resolver identity. It is
// therefore outside the member-facing Support frontend boundary.
//
// -----------------------------------------------------------------------------

export * from './get-support-case-resolution.api';