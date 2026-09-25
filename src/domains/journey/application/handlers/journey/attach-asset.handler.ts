// src/domains/journey/application/handlers/journey/attach-asset.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching an Asset-domain resource
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - convert attachment configuration into Journey domain value objects;
// - create the Journey-owned JourneyAsset attachment entity;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// This handler does NOT:
// - create the underlying Asset-domain resource;
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Architectural boundary:
//
//   Asset domain
//       │
//       │ assetPublicId
//       ▼
//   JourneyAsset
//       │
//       ▼
//   Journey aggregate
//
// The Asset itself remains owned by the Asset domain.
// Journey owns only the attachment relationship.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyAssetCommand } from '../../commands';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyAssetEntity } from '../../../domain/entities/journey-asset.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyAssetPublicId,
  JourneyAssetSortOrder,
  JourneyAssetTypeValueObject,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachAssetHandler implements CommandHandler<
  AttachJourneyAssetCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AttachJourneyAssetCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Convert Attachment Configuration Into Domain Value Objects
    // -------------------------------------------------------------------------

    const type = new JourneyAssetTypeValueObject(command.type);

    const sortOrder = new JourneyAssetSortOrder(command.sortOrder);

    // -------------------------------------------------------------------------
    // Create Journey Asset Attachment
    // -------------------------------------------------------------------------
    //
    // The external Asset already exists in the Asset domain.
    //
    // We create only the Journey-owned attachment entity. Its public ID is
    // generated by Journey, while assetPublicId remains an opaque reference
    // to the Asset domain.
    //

    const now = new Date();

    const asset = JourneyAssetEntity.create({
      publicId: new JourneyAssetPublicId(),
      assetPublicId: command.assetPublicId,
      type,
      sortOrder,
      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // Journey owns the attachment relationship and its business rules.
    //

    aggregate.attachAsset(asset);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
