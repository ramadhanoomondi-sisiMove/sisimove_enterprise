export class PermissionResponse {
  constructor(
    public readonly id: string,
    public readonly publicId: string,

    public readonly name: string,
    public readonly code: string,

    public readonly resource: string,
    public readonly action: string,

    public readonly description: string | undefined,

    public readonly isSystem: boolean,
    public readonly isActive: boolean,

    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    Object.freeze(this);
  }
}
