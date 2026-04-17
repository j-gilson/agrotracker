export const AppRoutes = {
  HOME: '/' as const,
  AUTH: '/auth' as const,
  FAZENDAS: '/fazendas' as const,
  CREATE_FAZENDA: '/fazendas/create' as const,
  INVENTARIO: '/inventario' as const,
  MANEJOS: '/manejos' as const,
  SCANNER: '/scanner' as const,
  CREATE_ANIMAL: '/animal/create' as const,
  ANIMAL_LIST: '/animal' as const,
  ANIMAL_DETAIL: (id: string | number) => ({
    pathname: '/animal/[id]' as const,
    params: { id },
  }),
} as const;

export type StaticAppRoute =
  | typeof AppRoutes.HOME
  | typeof AppRoutes.AUTH
  | typeof AppRoutes.FAZENDAS
  | typeof AppRoutes.CREATE_FAZENDA
  | typeof AppRoutes.INVENTARIO
  | typeof AppRoutes.MANEJOS
  | typeof AppRoutes.SCANNER
  | typeof AppRoutes.CREATE_ANIMAL
  | typeof AppRoutes.ANIMAL_LIST;
