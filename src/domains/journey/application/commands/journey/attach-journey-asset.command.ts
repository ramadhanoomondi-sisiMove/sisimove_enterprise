// src/domains/journey/application/commands/journey/attach-asset.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyAssetPublicIdReference } from '../../../domain/value-objects/journey-asset-public-id-reference.vo';
import type { JourneyAssetType } from '../../../domain/value-objects/journey-asset-type.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class AttachJourneyAssetCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Public reference of the external Asset being attached.
     *
     * The Asset itself belongs to the Asset domain. Journey only creates
     * the JourneyAsset attachment relationship.
     */
    public readonly assetPublicId: JourneyAssetPublicIdReference,

    /**
     * Type of Journey asset attachment.
     */
    public readonly type: JourneyAssetType,

    /**
     * Display ordering of the Journey asset.
     */
    public readonly sortOrder: number = 0,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
