// src/domains/journey/application/commands/journey/attach-preferences.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyPreferencesPublicId } from '../../../domain/value-objects/journey-preferences-public-id.vo';

export class AttachPreferencesCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly preferencesPublicId: JourneyPreferencesPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
