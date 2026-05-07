import React from 'react';
import { MemberRole } from '../../domain/membership/types';
import { usePermissions } from '../../core/auth/usePermissions';
import { AccessDeniedScreen } from '../screens/AccessDeniedScreen';
import { ErrorState } from './ErrorState';
import { Loading } from './Loading';

export const RoleGuard: React.FC<
  React.PropsWithChildren<{ fazendaId?: string; roles: MemberRole[] }>
> = ({ fazendaId, roles, children }) => {
  const { role, loading } = usePermissions(fazendaId);

  if (!fazendaId?.trim()) {
    return <ErrorState message="Nenhuma fazenda foi informada para validar o acesso." />;
  }

  if (loading) {
    return <Loading text="Carregando acesso..." />;
  }

  if (!role || !roles.includes(role)) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
};
