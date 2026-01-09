import { EntityValidationError } from '../../errors/domainErrors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmptyEmailError extends EntityValidationError {
  constructor() {
    super('email', 'cannot be empty');
    this.name = 'EmptyEmailError';
  }
}

export class InvalidEmailFormatError extends EntityValidationError {
  constructor(value: string) {
    super('email', `invalid format: ${value} (must include @ and a valid domain)`);
    this.name = 'InvalidEmailFormatError';
  }
}

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static fromString(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new EmptyEmailError();
    }

    const normalized = value.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
      throw new InvalidEmailFormatError(value);
    }

    return new Email(normalized);
  }

  public equals(other: Email): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
