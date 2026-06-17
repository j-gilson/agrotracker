import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FazendaMember } from '../../domain/membership/entities/FazendaMember';
import { MemberRole } from '../../domain/membership/types';
import { theme } from '../../core/theme';
import { Button, Card, EmptyState, ErrorState, Loading, useSnackbar } from '../components';
import { useTeamManagement } from '../viewmodels/useTeamManagement';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const MembersListScreen: React.FC<{ fazendaId: string }> = ({ fazendaId }) => {
  const { members, loading, error, refresh, changeRole, toggleActive, remove, currentMember } =
    useTeamManagement(fazendaId);
  const { showSnackbar } = useSnackbar();
  const hasFocusedOnceRef = React.useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }

      refresh();
    }, [refresh])
  );

  const handleChangeRole = useCallback(
    async (memberId: string, role: MemberRole) => {
      try {
        await changeRole(memberId, role);
        showSnackbar({ message: 'Papel atualizado com sucesso.', variant: 'success' });
      } catch (err: unknown) {
        showSnackbar({ message: err instanceof Error ? err.message : 'Erro ao atualizar papel.', variant: 'error' });
      }
    },
    [changeRole, showSnackbar]
  );

  const handleToggle = useCallback(
    async (memberId: string) => {
      try {
        await toggleActive(memberId);
        showSnackbar({ message: 'Status atualizado com sucesso.', variant: 'success' });
      } catch (err: unknown) {
        showSnackbar({ message: err instanceof Error ? err.message : 'Erro ao atualizar membro.', variant: 'error' });
      }
    },
    [showSnackbar, toggleActive]
  );

  const handleRemove = useCallback(
    async (memberId: string) => {
      try {
        await remove(memberId);
        showSnackbar({ message: 'Membro removido com sucesso.', variant: 'success' });
      } catch (err: unknown) {
        showSnackbar({ message: err instanceof Error ? err.message : 'Erro ao remover membro.', variant: 'error' });
      }
    },
    [remove, showSnackbar]
  );

  const renderItem = ({ item }: { item: FazendaMember }) => {
    const isSelf = currentMember?.userId === item.userId;
    const canManageMembers = currentMember?.role === 'ADMIN';
    const nextRole: MemberRole = item.role === 'ADMIN' ? 'FUNCIONARIO' : 'ADMIN';

    return (
      <Card marginBottom={12} padding={14} style={styles.card}>
        <View style={styles.rowTop}>
          <View style={styles.info}>
            <Text style={styles.name}>
              {item.nome}
              {isSelf ? ' (você)' : ''}
            </Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
          <View style={styles.badges}>
            <Text style={[styles.badge, item.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeFuncionario]}>
              {item.role}
            </Text>
            <Text style={[styles.badge, item.active ? styles.badgeActive : styles.badgeInactive]}>
              {item.active ? 'ATIVO' : 'INATIVO'}
            </Text>
          </View>
        </View>

        {canManageMembers ? (
          <View style={styles.actions}>
            <Button
              onPress={() => handleChangeRole(item.id, nextRole)}
              title={item.role === 'ADMIN' ? 'Rebaixar' : 'Promover'}
              variant="secondary"
              style={styles.action}
            />
            <Button
              onPress={() => handleToggle(item.id)}
              title={item.active ? 'Desativar' : 'Ativar'}
              variant="ghost"
              style={styles.action}
            />
            <Button
              onPress={() => handleRemove(item.id)}
              title="Remover"
              variant="danger"
              disabled={isSelf}
              style={styles.action}
            />
          </View>
        ) : null}
      </Card>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      title="Nenhum membro encontrado."
      subtitle="Convide funcionários para participar desta fazenda."
    />
  );

  if (loading && members.length === 0) {
    return <Loading text="Carregando membros..." variant="list" />;
  }

  if (error && members.length === 0) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <FlatList
        data={members}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[theme.colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
  },
  listContainer: {
    padding: theme.spacing.sm,
    flexGrow: 1,
  },
  card: {
    borderColor: theme.colors.border,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  email: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  badges: {
    alignItems: 'flex-end',
    gap: theme.spacing.xxs,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    overflow: 'hidden',
  },
  badgeAdmin: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.textInverse,
  },
  badgeFuncionario: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.textAccent,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeActive: {
    backgroundColor: theme.colors.successSoft,
    color: theme.colors.success,
  },
  badgeInactive: {
    backgroundColor: theme.colors.dangerSurface,
    color: theme.colors.danger,
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  action: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 10,
  },
});
