import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useHome } from '../viewmodels/useHome';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { router, useFocusEffect, type Href } from 'expo-router';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { refreshOnReturn } from '../navigation/refreshOnReturn';

export const HomeScreen: React.FC = () => {
  const {
    activeFarmId,
    farms,
    loading: farmsLoading,
    refreshFarms,
    setActiveFarm,
  } = useActiveFarm();
  const { stats, loading: statsLoading, error, refresh } = useHome(activeFarmId, farms.length);
  const hasFocusedOnceRef = useRef(false);
  const refreshHome = useCallback(async () => {
    await refreshFarms();
    await refresh();
  }, [refresh, refreshFarms]);

  useFocusEffect(
    useCallback(() => {
      refreshOnReturn(hasFocusedOnceRef, refreshHome);
    }, [refreshHome])
  );

  const handleScanPress = () => {
    router.push(AppRoutes.SCANNER_WITH_FAZENDA(activeFarmId));
  };

  const handleInventarioPress = () => {
    router.push({
      pathname: AppRoutes.INVENTARIO,
      params: activeFarmId ? { fazendaId: activeFarmId } : {},
    });
  };

  const handleManejosPress = () => {
    router.push({ pathname: AppRoutes.MANEJOS });
  };

  const handleNovaFazendaPress = () => {
    router.push({ pathname: AppRoutes.CREATE_FAZENDA });
  };

  const handleFazendasPress = () => {
    router.push({ pathname: AppRoutes.FAZENDAS });
  };

  const ProfileAccess = () => (
    <Button
      fullWidth
      onPress={() => router.push(AppRoutes.PROFILE as Href)}
      style={styles.profileButton}
      title="Meu Perfil"
      variant="ghost"
    />
  );

  const InvitesAccess = () => (
    <Button
      fullWidth
      onPress={() => router.push(AppRoutes.INVITES as Href)}
      style={styles.invitesButton}
      title="Meus Convites"
      variant="secondary"
    />
  );

  const StatCard = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: number;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      accessibilityLabel={`${label}: ${value}. Abrir ${label}`}
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.statCardPressable}
    >
      <Card marginBottom={0} padding={16} shadow={false} style={styles.statCard}>
        <Text style={styles.statAffordance}>{'>'}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Card>
    </TouchableOpacity>
  );

  const QuickActionCard = ({
    label,
    onPress,
    icon,
  }: {
    label: string;
    onPress: () => void;
    icon: string;
  }) => (
    <Card marginBottom={0} onPress={onPress} padding={20} style={styles.quickActionCard}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Card>
  );

  if (farmsLoading) {
    return <Loading text="Carregando..." />;
  }

  if (farms.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={farmsLoading || statsLoading}
              onRefresh={refreshHome}
              colors={[theme.colors.primary]}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>
              Comece cadastrando sua primeira fazenda.
            </Text>
          </View>
          <Card shadow={false}>
            <EmptyState
              title="Nenhuma fazenda cadastrada"
              subtitle="Cadastre sua primeira fazenda para visualizar indicadores reais do sistema."
              buttonText="Cadastrar fazenda"
              onPress={handleNovaFazendaPress}
            />
          </Card>
          <InvitesAccess />
          <ProfileAccess />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={statsLoading}
            onRefresh={refreshHome}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Olá!</Text>
          <Text style={styles.subtitle}>
            Gerencie seu rebanho com facilidade.
          </Text>
          <ProfileAccess />
        </View>

        <View style={styles.farmSelectorSection}>
          <Text style={styles.farmSelectorLabel}>Fazenda Ativa</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.farmChipsContainer}
          >
            {farms.map((farm, index) => {
              const isActive = farm.id === activeFarmId;
              return (
                <TouchableOpacity
                  key={farm.id ?? `farm-${index}`}
                  onPress={() => {
                    if (farm.id) setActiveFarm(farm.id);
                  }}
                  style={[
                    styles.farmChip,
                    isActive && styles.farmChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.farmChipText,
                      isActive && styles.farmChipTextActive,
                    ]}
                  >
                    {farm.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Button
          fullWidth
          icon={<Text style={styles.scanButtonIcon}>📸</Text>}
          style={styles.scanButton}
          onPress={handleScanPress}
          title="Escanear Novo Brinco"
        />

        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <View style={styles.statsRow}>
            <StatCard
              label="Animais"
              onPress={handleInventarioPress}
              value={stats.animais}
            />
            <StatCard
              label="Manejos"
              onPress={handleManejosPress}
              value={stats.manejos}
            />
            <StatCard
              label="Fazendas"
              onPress={handleFazendasPress}
              value={stats.fazendas}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            label="Inventário"
            onPress={handleInventarioPress}
            icon="📋"
          />
          <QuickActionCard
            label="Manejos"
            onPress={handleManejosPress}
            icon="📝"
          />
          <QuickActionCard
            label="Nova Fazenda"
            onPress={handleNovaFazendaPress}
            icon="🚜"
          />
        </View>

        <Button
          fullWidth
          onPress={() => router.push({ pathname: AppRoutes.FAZENDAS })}
          style={styles.secondaryButton}
          title="Ver Todas as Fazendas"
          variant="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  farmSelectorSection: {
    marginBottom: theme.spacing.lg,
  },
  farmSelectorLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  farmChipsContainer: {
    gap: theme.spacing.sm,
  },
  farmChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.backgroundMuted,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },
  farmChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  farmChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  farmChipTextActive: {
    color: theme.colors.textInverse,
  },
  scanButton: {
    marginBottom: theme.spacing.xl,
  },
  scanButtonIcon: {
    fontSize: theme.sizes.iconSm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statCardPressable: {
    flex: 1,
    marginHorizontal: theme.spacing.xxs,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.successSoft,
    alignItems: 'center',
    borderColor: theme.colors.transparent,
  },
  statAffordance: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.sm,
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xxs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  sectionTitle: {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xl,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    minWidth: 96,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs - 2,
  },
  quickActionIcon: {
    fontSize: theme.sizes.iconMd,
    marginBottom: theme.spacing.xs,
  },
  quickActionLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  secondaryButton: {
    marginTop: theme.spacing.sm,
  },
  profileButton: {
    marginTop: theme.spacing.md,
  },
  invitesButton: {
    marginTop: theme.spacing.lg,
  },
});
