import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Invite } from '../../domain/membership/entities/Invite';
import { theme } from '../../core/theme';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Loading,
  useSnackbar,
} from '../components';
import { useInvites } from '../viewmodels/useInvites';
import { useActiveFarm } from '../contexts/ActiveFarmContext';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

const roleLabels = {
  ADMIN: 'Administrador',
  FUNCIONARIO: 'Funcionário',
} as const;

export const InvitesScreen: React.FC = () => {
  const { refreshFarms } = useActiveFarm();
  const {
    invites,
    loading,
    processingId,
    error,
    refresh,
    accept,
    reject,
  } = useInvites(refreshFarms);
  const { showSnackbar } = useSnackbar();
  const hasFocusedOnceRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }
      void refresh();
    }, [refresh])
  );

  const handleAccept = useCallback(
    async (invite: Invite) => {
      try {
        await accept(invite);
        showSnackbar({
          message: 'Convite aceito com sucesso.',
          variant: 'success',
        });
      } catch (err: unknown) {
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Nao foi possivel aceitar o convite.',
          variant: 'error',
        });
      }
    },
    [accept, showSnackbar]
  );

  const handleReject = useCallback(
    async (inviteId: string) => {
      try {
        await reject(inviteId);
        showSnackbar({
          message: 'Convite recusado.',
          variant: 'success',
        });
      } catch (err: unknown) {
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Nao foi possivel recusar o convite.',
          variant: 'error',
        });
      }
    },
    [reject, showSnackbar]
  );

  const renderItem = ({ item }: { item: Invite }) => {
    const processing = processingId === item.id;

    return (
      <Card marginBottom={12} style={styles.card}>
        <Text style={styles.farmName}>
          {item.fazendaNome ?? 'Fazenda'}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detail}>
            Papel proposto: {roleLabels[item.role]}
          </Text>
          <Text style={styles.detail}>Status: PENDENTE</Text>
          <Text style={styles.detail}>
            Data: {item.createdAt.toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button
            title="Aceitar"
            onPress={() => handleAccept(item)}
            loading={processing}
            disabled={Boolean(processingId)}
            style={styles.action}
          />
          <Button
            title="Recusar"
            onPress={() => handleReject(item.id)}
            variant="danger"
            disabled={Boolean(processingId)}
            style={styles.action}
          />
        </View>
      </Card>
    );
  };

  if (loading && invites.length === 0) {
    return <Loading text="Carregando convites..." variant="list" />;
  }

  if (error && invites.length === 0) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Convites</Text>
        <Text style={styles.subtitle}>
          Convites pendentes enviados para seu e-mail
        </Text>
      </View>
      <FlatList
        data={invites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum convite pendente"
            subtitle="Quando uma fazenda convidar você, o convite aparecerá aqui."
          />
        }
        contentContainerStyle={styles.list}
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
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  subtitle: {
    marginTop: theme.spacing.xxs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textInverse,
  },
  list: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  card: {
    borderColor: theme.colors.border,
  },
  farmName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  details: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xxs,
  },
  detail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  action: {
    flex: 1,
  },
});
