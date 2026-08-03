// src/foundation/database/prisma/prisma-base-mapper.ts

import type { Prisma } from '@prisma/client';

import { PrismaMapper } from './prisma-mapper';

/**
 * Base implementation for Prisma persistence mappers.
 *
 * Provides reusable conversion helpers while leaving concrete
 * mapping implementations to derived classes.
 *
 * @template TDomain Domain entity or aggregate.
 * @template TModel Prisma query model.
 * @template TCreate Prisma create input.
 * @template TUpdate Prisma update input.
 */
export abstract class PrismaBaseMapper<
  TDomain,
  TModel,
  TCreate,
  TUpdate = TCreate,
> extends PrismaMapper<TDomain, TModel, TCreate, TUpdate> {
  /**
   * Converts a nullable persistence value into an optional domain value.
   */
  protected optional<T>(value: T | null): T | undefined {
    return value ?? undefined;
  }

  /**
   * Converts an optional domain value into a nullable persistence value.
   */
  protected nullable<T>(value: T | undefined): T | null {
    return value ?? null;
  }

  /**
   * Converts immutable domain metadata into a Prisma JSON value.
   *
   * Returns undefined when no metadata exists so callers can decide
   * whether to omit the field or explicitly store a JSON null.
   */
  protected json(
    value?: Readonly<Record<string, unknown>>,
  ): Prisma.InputJsonValue | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value as Prisma.InputJsonValue;
  }

  /**
   * Converts Prisma JSON into immutable domain metadata.
   */
  protected metadata(
    value: Prisma.JsonValue | null,
  ): Readonly<Record<string, unknown>> | undefined {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    return Object.freeze({
      ...(value as Record<string, unknown>),
    });
  }

  /**
   * Returns a shallow immutable copy.
   */
  protected freeze<T extends object>(value: T): Readonly<T> {
    return Object.freeze({ ...value });
  }

  /**
   * Returns a shallow copy of an array.
   */
  protected cloneArray<T>(value: readonly T[]): T[] {
    return [...value];
  }
}
