import { Member } from '../entities/member';
import { EntityId } from '../entities/valueObjects/entityId';

// Port d'accès au stockage des membres. Les adapters (ex: DB, mémoire) doivent implémenter cet
// interface pour le cas d'utilisation "badge d'entrée".
export interface MemberRepository {
  findById(id: EntityId): Promise<Member | null>;
  save(member: Member): Promise<void>;
}
