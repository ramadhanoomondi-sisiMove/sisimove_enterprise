// -----------------------------------------------------------------------------
// Assets — Get Private Asset Content Query
// -----------------------------------------------------------------------------
//
// Internal application query for retrieving physical content of a private
// Asset after the consuming use case has established authorization.
//
// This query does not perform HTTP authorization. It accepts only the stable
// Asset public identity and never accepts physical storage addressing.
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';
import type { AssetPublicId } from '../../domain/value-objects';

export class GetPrivateAssetContentQuery implements Query {
  public constructor(public readonly publicId: AssetPublicId) {}
}

export default GetPrivateAssetContentQuery;
