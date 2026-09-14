// -----------------------------------------------------------------------------
// sisiMove — Get Public Trust Profile By Member Query
// -----------------------------------------------------------------------------
//
// Public marketplace query.
//
// The caller supplies the opaque Identity/Member public identifier because
// that is the cross-domain reference used by the public Journey and Traveller
// read models.
//
// The identifier remains a primitive at this application boundary, matching
// the existing Trust query convention.
//
// This query deliberately does not depend on:
// - REST controllers;
// - REST mappers;
// - HTTP DTOs;
// - Prisma models;
// - presentation-layer response types.
//
// The handler is responsible for retrieving and returning the reduced public
// Trust projection.
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetPublicTrustProfileByMemberQuery extends Query {
  public constructor(public readonly memberPublicId: string) {
    super();
  }
}

export default GetPublicTrustProfileByMemberQuery;
