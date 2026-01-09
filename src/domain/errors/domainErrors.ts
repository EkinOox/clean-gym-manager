export class InvalidEntityStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEntityStateError';
  }
}

export class EntityValidationError extends Error {
  constructor(field: string, reason: string) {
    super(`Invalid ${field}: ${reason}`);
    this.name = 'EntityValidationError';
  }
}
