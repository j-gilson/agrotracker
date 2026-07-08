import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
} from 'react-native';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { RoleGuard, Button, Card, ErrorState, PageHeader } from '../components';
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
    return <ErrorState message="Não foi possível abrir esta tela. Volte e tente novamente." />;
  }

  return (
    <RoleGuard fazendaId={id} roles={['ADMIN', 'FUNCIONARIO']}>
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
        <PageHeader
          title="Equipe"
          subtitle="Gerencie os membros e Convites da Fazenda."
          variant="banner"
        />

        {canInviteMembers ? (
          <View style={styles.inviteCtaWrapper}>
            <Card
              accessibilityLabel="Convidar novo membro para a fazenda"
              onPress={() =>
                router.push({
                  pathname: AppRoutes.FAZENDA_TEAM_INVITE,
                  params: { fazendaId: id },
                } as unknown as Href)
              }
              padding={16}
              shadow={false}
              style={styles.inviteCard}
            >
              <Text style={styles.inviteIcon}>👤</Text>
              <View style={styles.inviteText}>
                <Text style={styles.inviteTitle}>Convidar membro</Text>
                <Text style={styles.inviteSubtitle}>
                  Convide novos membros para esta fazenda.
                </Text>
              </View>
              <Text style={styles.inviteCta}>+</Text>
            </Card>
          </View>
        ) : null}

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
  inviteCtaWrapper: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  inviteCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
    flexDirection: 'row',
  },
  inviteIcon: {
    fontSize: theme.sizes.iconMd,
    marginRight: theme.spacing.sm,
  },
  inviteText: {
    flex: 1,
  },
  inviteTitle: {
    color: theme.colors.primaryDark,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  inviteSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.sm,
    marginTop: theme.spacing.xxs,
  },
  inviteCta: {
    color: theme.colors.primaryDark,
    fontSize: theme.sizes.iconMd,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
