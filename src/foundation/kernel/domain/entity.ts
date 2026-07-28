// src/foundation/kernel/domain/entity.ts

import { PublicEntityId } from './public-entity-id';
import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<
  TProps,
  TPublicId extends PublicEntityId = PublicEntityId,
> {
  protected readonly _id: UniqueEntityId;
  protected readonly _publicId: TPublicId;
  protected props: TProps;

  protected constructor(
    props: TProps,
    id?: UniqueEntityId,
    publicId?: TPublicId,
  ) {
    this._id = id ?? new UniqueEntityId();

    this._publicId = publicId ?? (new PublicEntityId() as unknown as TPublicId);

    this.props = props;
  }

  // --------------------------------------------------------------------------
  // Identity
  // --------------------------------------------------------------------------

  get id(): UniqueEntityId {
    return this._id;
  }

  get publicId(): TPublicId {
    return this._publicId;
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  equals(entity?: Entity<TProps, TPublicId>): boolean {
    if (entity === undefined) {
      return false;
    }

    return this.id.equals(entity.id);
  }
}
