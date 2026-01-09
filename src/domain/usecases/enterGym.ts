import { MemberRepository } from '../repositories/memberRepository';
import { GymGate } from '../services/gymGate';
import { EntityId } from '../entities/valueObjects/entityId';

export class MemberNotFoundError extends Error {
  constructor(memberId: string) {
    super(`Member not found: ${memberId}`);
    this.name = 'MemberNotFoundError';
  }
}

export class AccessDeniedError extends Error {
  constructor(memberId: string) {
    super(`Access denied for member: ${memberId}`);
    this.name = 'AccessDeniedError';
  }
}

export class EnterGym {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly gymGate: GymGate,
  ) {}

  public async execute(memberId: string): Promise<void> {
    const id = EntityId.fromString(memberId);

    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }

    const allowed = member.checkAccess();
    await this.memberRepository.save(member);

    if (!allowed) {
      throw new AccessDeniedError(memberId);
    }

    await this.gymGate.open(member.id);
  }
}
