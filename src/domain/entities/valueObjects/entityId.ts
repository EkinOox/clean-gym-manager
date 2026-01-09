import { randomUUID } from 'node:crypto';

export class InvalidEntityIdFormatError extends Error {
  constructor(value?: string) {
    super(value ? `Invalid EntityId format: ${value}` : 'Invalid EntityId format');
    this.name = 'InvalidEntityIdFormatError';
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class EntityId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(): EntityId {
    return new EntityId(randomUUID());
  }

  public static fromString(value: string): EntityId {
    if (!value || !UUID_REGEX.test(value)) {
      throw new InvalidEntityIdFormatError(value);
    }
    return new EntityId(value);
  }

  public equals(other: EntityId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
