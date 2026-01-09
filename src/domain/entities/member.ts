// On conserve InvalidEntityStateError pour de futures transitions d'état (ex: supprimé/suspendu)
import { EntityValidationError, InvalidEntityStateError } from '../errors/domainErrors';
import { Email } from './valueObjects/email';
import { EntityId } from './valueObjects/entityId';

// === ERRORS ===
export class MemberValidationError extends EntityValidationError {
  constructor(field: string, reason: string) {
    super(field, reason);
    this.name = 'MemberValidationError';
  }
}

// === PROPS ===
type MemberProps = {
  id: EntityId;
  email: Email;
  subscriptionEndDate: Date;
  isActive: boolean;
};

type CreateMemberProps = {
  email: string;
  subscriptionEndDate?: Date;
};

// === ENTITY ===
export class Member {
  private props: MemberProps;

  private constructor(props: MemberProps) {
    this.props = props;
  }

  // === FACTORIES ===
  public static create(props: CreateMemberProps): Member {
    const email = Email.fromString(props.email);
    const endDate = props.subscriptionEndDate ?? new Date();
    const isActive = endDate.getTime() > Date.now();

    return new Member({
      id: EntityId.create(),
      email,
      subscriptionEndDate: endDate,
      isActive,
    });
  }

  public static reconstitute(props: MemberProps): Member {
    return new Member(props);
  }

  // === GETTERS ===
  get id(): EntityId {
    return this.props.id;
  }

  get email(): string {
    return this.props.email.toString();
  }

  get subscriptionEndDate(): Date {
    return this.props.subscriptionEndDate;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  // === BUSINESS RULES ===
  public renewSubscription(months: number): void {
    if (!Number.isInteger(months) || months <= 0) {
      throw new MemberValidationError('months', 'must be a positive integer');
    }

    const now = new Date();
    const base = this.props.subscriptionEndDate.getTime() > now.getTime()
      ? this.props.subscriptionEndDate
      : now;

    const nextEndDate = new Date(base);
    nextEndDate.setMonth(nextEndDate.getMonth() + months);

    this.props.subscriptionEndDate = nextEndDate;
    this.props.isActive = true;
  }

  public checkAccess(): boolean {
    const now = new Date();
    const active = this.props.subscriptionEndDate.getTime() > now.getTime();
    this.props.isActive = active;
    return active;
  }

  public equals(other: Member): boolean {
    if (!other) return false;
    return this.props.id.equals(other.id);
  }

  // === SERIALIZATION ===
  public toJSON(): object {
    return {
      id: this.props.id.toString(),
      email: this.props.email.toString(),
      subscriptionEndDate: this.props.subscriptionEndDate.toISOString(),
      isActive: this.props.isActive,
    };
  }
}
