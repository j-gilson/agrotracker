import { FazendaMember } from "../domain/entities/FazendaMember";

export interface IFazendaMemberRepository {
  findById(id: string): Promise<FazendaMember | undefined>;
  findByFazendaAndUser(fazendaId: string, userId: string): Promise<FazendaMember | undefined>;
  findAllByFazenda(fazendaId: string): Promise<FazendaMember[]>;
  findAllByUser(userId: string): Promise<FazendaMember[]>;
  save(member: FazendaMember): Promise<FazendaMember>;
  update(member: FazendaMember): Promise<FazendaMember>;
  deleteById(id: string): Promise<void>;
}
