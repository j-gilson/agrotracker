import { MemberRole } from '../../domain/membership/types';

export const canManageFarm = (role: MemberRole | null): boolean => role === 'ADMIN';
export const canInviteMembers = (role: MemberRole | null): boolean => role === 'ADMIN';
export const canEditFarm = (role: MemberRole | null): boolean => role === 'ADMIN';
export const canCreateAnimal = (role: MemberRole | null): boolean =>
  role === 'ADMIN' || role === 'FUNCIONARIO';
export const canRegisterManejo = (role: MemberRole | null): boolean =>
  role === 'ADMIN' || role === 'FUNCIONARIO';

