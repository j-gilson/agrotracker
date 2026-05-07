export const AppRoutes = {
  HOME: '/' as const,
  AUTH: '/auth' as const,
  REGISTER: '/auth/register' as const,
  FAZENDAS: '/fazendas' as const,
  CREATE_FAZENDA: '/fazendas/create' as const,
  FAZENDA_TEAM: '/fazenda/team' as const,
  FAZENDA_TEAM_INVITE: '/fazenda/team/invite' as const,
  INVENTARIO: '/inventario' as const,
  MANEJOS: '/manejos' as const,
  SCANNER: '/scanner' as const,
  CREATE_ANIMAL: '/animal/create' as const,
  CREATE_EVENT: (animalId: string | number, fazendaId: string) => ({
    pathname: '/animal/[id]/event/create' as const,
    params: { id: animalId, animalId, fazendaId },
  }),
  ANIMAL_LIST: '/animal' as const,
  ANIMAL_DETAIL: (id: string | number) => ({
    pathname: '/animal/[id]' as const,
    params: { id },
  }),
  AUDIT_ENTITY_TIMELINE: (entityType: string, entityId: string) => ({
    pathname: '/audit/entity/timeline' as const,
    params: { entityType, entityId },
  }),
  AUDIT_FAZENDA: (fazendaId: string) => ({
    pathname: '/audit/fazenda' as const,
    params: { fazendaId },
  }),
  AUDIT_USER: (userId: string) => ({
    pathname: '/audit/user' as const,
    params: { userId },
  }),
} as const;

export type StaticAppRoute =
  | typeof AppRoutes.HOME
  | typeof AppRoutes.AUTH
  | typeof AppRoutes.REGISTER
  | typeof AppRoutes.FAZENDAS
  | typeof AppRoutes.CREATE_FAZENDA
  | typeof AppRoutes.FAZENDA_TEAM
  | typeof AppRoutes.FAZENDA_TEAM_INVITE
  | typeof AppRoutes.INVENTARIO
  | typeof AppRoutes.MANEJOS
  | typeof AppRoutes.SCANNER
  | typeof AppRoutes.CREATE_ANIMAL
  | typeof AppRoutes.ANIMAL_LIST;
