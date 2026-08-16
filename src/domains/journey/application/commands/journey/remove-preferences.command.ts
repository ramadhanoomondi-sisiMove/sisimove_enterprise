// src/domains/journey/application/commands/journey/remove-preferences.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

export class RemovePreferencesCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
