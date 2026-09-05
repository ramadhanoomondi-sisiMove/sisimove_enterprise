// -----------------------------------------------------------------------------
// Accounting Journal — Post Accounting Journal Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for posting an existing Accounting Journal aggregate.
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
// The caller is only requesting execution of the posting operation.
//
// This request does NOT supply:
//
// - Accounting Journal public ID;
// - posting timestamp;
// - journal entries;
// - journal lines;
// - Accounting Account references;
// - Accounting Period references;
// - correlation ID;
// - causation ID.
//
// The Accounting Journal public identity is supplied by the route.
//
// The posting timestamp is established by the application/domain execution
// workflow when the operation is performed.
//
// Correlation and causation metadata belong to the application execution
// context.
//
// The request does NOT:
//
// - validate Accounting Account existence;
// - validate Accounting Account status;
// - validate Accounting Period existence;
// - validate whether the Accounting Period is open;
// - determine whether the journal is balanced;
// - validate the Accounting Journal lifecycle;
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
//     aggregate.post()
//        ↓
//     repository.save()
//
// The application/domain workflow performs required cross-aggregate validation.
//
// The aggregate remains responsible for:
//
// - DRAFT → POSTED lifecycle;
// - requiring journal entries;
// - requiring lines on every entry;
// - enforcing journal currency consistency;
// - enforcing balanced debit and credit totals;
// - recording AccountingJournalPostedEvent.
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
 * REST request for posting an Accounting Journal.
 *
 * Posting requires no caller-supplied body.
 *
 * The target journal is identified by the route, for example:
 *
 *     POST /accounting/journals/:publicId/post
 *
 * The application execution context supplies correlation and causation
 * metadata, while the posting workflow establishes the effective posting
 * timestamp.
 */
export class PostAccountingJournalRequestDto {}
