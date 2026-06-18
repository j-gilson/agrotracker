import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { RoleGuard, Button, ErrorState, PageHeader } from '../components';
import { MembersListScreen } from './MembersListScreen';
import { usePermissions } from '../../core/auth/usePermissions';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const TeamManagementScreen: React.FC = () => {
  const params = useLocalSearchParams<{ fazendaId?: string | string[] }>();
  const id =
    typeof params.fazendaId === 'string'
      ? params.fazendaId
      : Array.isArray(params.fazendaId)
      ? params.fazendaId[0]
      : '';
  const { canInviteMembers } = usePermissions(id);

  if (!id) {
    return <ErrorState message="Parâmetro obrigatório não informado: fazendaId." />;
  }

  return (
    <RoleGuard fazendaId={id} roles={['ADMIN', 'FUNCIONARIO']}>
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
        <PageHeader
          title="Equipe"
          variant="banner"
          rightAction={
            canInviteMembers ? (
              <Button
                onPress={() =>
                  router.push({
                    pathname: AppRoutes.FAZENDA_TEAM_INVITE,
                    params: { fazendaId: id },
                  } as unknown as Href)
                }
                title="Convidar"
                variant="secondary"
                style={styles.inviteButton}
              />
            ) : undefined
          }
        />

        <MembersListScreen fazendaId={id} />
      </SafeAreaView>
    </RoleGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
  },
  inviteButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderColor: theme.colors.transparent,
  },
});
