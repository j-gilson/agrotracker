export const AppRoutes = {
  HOME: '/' as const,
  AUTH: '/auth' as const,
  REGISTER: '/auth/register' as const,
  FAZENDAS: '/fazendas' as const,
  CREATE_FAZENDA: '/fazendas/create' as const,
  FAZENDA_TEAM: '/fazenda/team' as const,
  FAZENDA_TEAM_INVITE: '/fazenda/team/invite' as const,
  INVITES: '/invites' as const,
  INVENTARIO: '/inventario' as const,
  MANEJOS: '/manejos' as const,
  SCANNER_WITH_FAZENDA: (fazendaId?: string | null) => ({
    pathname: '/scanner' as const,
    params: fazendaId ? { fazendaId } : {},
  }),
  CREATE_ANIMAL: '/animal/create' as const,
  CREATE_ANIMAL_WITH_CODE: (
    fazendaId: string,
    codigoIdentificacao: string
  ) => ({
    pathname: '/animal/create' as const,
    params: { fazendaId, codigoIdentificacao },
  }),
  CREATE_EVENT: (animalId: string | number, fazendaId: string) => ({
    pathname: '/animal/[id]/event/create' as const,
    params: { id: animalId, animalId, fazendaId },
  }),
  ANIMAL_LIST: '/animal' as const,
  ANIMAL_DETAIL: (id: string | number) => ({
    pathname: '/animal/[id]' as const,
    params: { id },
  }),
  EDIT_ANIMAL: (id: string | number) => ({
    pathname: '/animal/[id]/edit' as const,
    params: { id },
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
  | typeof AppRoutes.INVITES
  | typeof AppRoutes.INVENTARIO
  | typeof AppRoutes.MANEJOS
  | typeof AppRoutes.CREATE_ANIMAL
  | typeof AppRoutes.ANIMAL_LIST;
