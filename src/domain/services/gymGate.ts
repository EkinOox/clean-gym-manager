import { EntityId } from '../entities/valueObjects/entityId';

// Port vers le système physique qui ouvre la porte de la salle.
export interface GymGate {
  open(memberId: EntityId): Promise<void>;
}
