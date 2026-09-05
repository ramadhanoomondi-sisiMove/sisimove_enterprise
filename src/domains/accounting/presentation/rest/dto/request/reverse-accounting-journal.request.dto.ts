// -----------------------------------------------------------------------------
// Accounting Journal — Reverse Accounting Journal Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for reversing an existing Accounting Journal aggregate.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//
// Route context supplies:
//
// - publicId.
//
// The caller is only requesting execution of the reversal operation.
//
// This request does NOT supply:
//
// - Accounting Journal public ID;
// - reversal timestamp;
// - journal entries;
// - journal lines;
// - Accounting Account references;
// - correlation ID;
// - causation ID.
//
// The Accounting Journal public identity is supplied by the route.
//
// The reversal timestamp is established by the application/domain execution
// workflow when the operation is performed.
//
// Correlation and causation metadata belong to the application execution
// context.
//
// This DTO does NOT:
//
// - create reversal journal lines;
// - mutate existing journal entries;
// - mutate existing journal lines;
// - load the Accounting Journal;
// - validate the Accounting Journal lifecycle;
// - validate external aggregates;
// - persist the aggregate;
// - access Prisma;
// - perform authorization.
//
// The application handler is responsible for:
//
//     route publicId
//        ↓
//     repository.findByPublicId()
//        ↓
//     aggregate.reverse()
//        ↓
//     repository.save()
//
// The aggregate remains responsible for:
//
// - POSTED → REVERSED lifecycle;
// - preventing reversal of non-posted journals;
// - preserving the original journal entries and lines;
// - ensuring reversal is terminal;
// - recording AccountingJournalReversedEvent.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {}
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for reversing an Accounting Journal.
 *
 * Reversal requires no caller-supplied body.
 *
 * The target journal is identified by the route, for example:
 *
 *     POST /accounting/journals/:publicId/reverse
 *
 * The application execution context supplies correlation and causation
 * metadata, while the reversal workflow establishes the effective reversal
 * timestamp.
 */
export class ReverseAccountingJournalRequestDto {}
