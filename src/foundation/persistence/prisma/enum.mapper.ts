// src/foundation/persistence/prisma/enum.mapper.ts

/**
 * Generic mapper for converting between persistence and domain enums.
 *
 * Assumptions:
 * - Both enums are string enums.
 * - Both enums expose identical string values.
 */
export class EnumMapper {
  /**
   * Prevent instantiation.
   */
  private constructor() {}

  /**
   * Maps a persistence enum value to its domain equivalent.
   */
  public static toDomain<TDomain extends string, TPersistence extends string>(
    value: TPersistence,
  ): TDomain {
    return value as unknown as TDomain;
  }

  /**
   * Maps a domain enum value to its persistence equivalent.
   */
  public static toPersistence<
    TPersistence extends string,
    TDomain extends string,
  >(value: TDomain): TPersistence {
    return value as unknown as TPersistence;
  }
}
