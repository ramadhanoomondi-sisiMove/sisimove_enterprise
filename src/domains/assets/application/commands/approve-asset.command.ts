import { Command } from '../../../../foundation/kernel/application/command';

import type { AssetModerationType } from '../../domain/value-objects';

export class ApproveAssetCommand extends Command {
  constructor(
    public readonly assetId: string,

    public readonly type: AssetModerationType,

    public readonly moderatorId: string | undefined,

    public readonly confidence: number | undefined,

    public readonly moderatedAt: Date,

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
