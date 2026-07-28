// src/domains/identity/presentation/rest/responses/base.response.ts

/**
 * Base API response shared across Identity resources.
 *
 * All public response DTOs should extend this class to provide a
 * consistent API contract while preventing exposure of internal IDs.
 */
export abstract class BaseResponse {
  /**
   * Public identifier exposed through the API.
   */
  publicId!: string;

  /**
   * Resource creation timestamp.
   */
  createdAt!: Date;

  /**
   * Last modification timestamp.
   */
  updatedAt!: Date;
}
