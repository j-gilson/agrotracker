import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useHome } from '../viewmodels/useHome';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { router, useFocusEffect, type Href } from 'expo-router';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { refreshOnReturn } from '../navigation/refreshOnReturn';
import { Event } from '../../domain/events/entities/Event';
import { EVENT_TYPE_OPTIONS, EventType } from '../../domain/events/types';
import { formatDate } from '../../core/utils/formatDate';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

const eventTypeLabels = EVENT_TYPE_OPTIONS.reduce<Record<EventType, string>>(
  (labels, option) => ({
    ...labels,
    [option.value]: option.label,
  }),
  {} as Record<EventType, string>
);

const getEventTypeLabel = (type: EventType): string => eventTypeLabels[type];

export const HomeScreen: React.FC = () => {
  const {
    activeFarmId,
    farms,
    loading: farmsLoading,
    refreshFarms,
  } = useActiveFarm();
  const { stats, latestEvents, loading: statsLoading, error, refresh } = useHome(
    activeFarmId,
    farms.length
  );
  const hasFocusedOnceRef = useRef(false);
  const activeFarm = farms.find((farm) => farm.id === activeFarmId) ?? farms[0];
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

  const handleCadastrarAnimalPress = () => {
    router.push({
      pathname: AppRoutes.CREATE_ANIMAL,
      params: activeFarmId ? { fazendaId: activeFarmId } : {},
    });
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

  const CompactProfileAccess = () => (
    <TouchableOpacity
      accessibilityLabel="Abrir Meu Perfil"
      accessibilityRole="button"
      activeOpacity={0.75}
      onPress={() => router.push(AppRoutes.PROFILE as Href)}
      style={styles.compactProfileButton}
    >
      <Text style={styles.compactProfileText}>Perfil</Text>
    </TouchableOpacity>
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
    actionLabel,
  }: {
    label: string;
    value: number;
    onPress: () => void;
    actionLabel: string;
  }) => (
    <TouchableOpacity
      accessibilityLabel={`${label}: ${value}. Abrir ${label}`}
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.statCardPressable}
    >
      <Card
        marginBottom={0}
        padding={16}
        shadow={false}
        style={styles.statCard}
      >
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statAffordance}>{actionLabel}</Text>
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
    <Card
      marginBottom={0}
      onPress={onPress}
      padding={20}
      style={styles.quickActionCard}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
      <Text style={styles.quickActionCta}>→</Text>
    </Card>
  );

  const LatestEventCard = ({ event }: { event: Event }) => (
    <Card
      marginBottom={theme.spacing.sm}
      padding={14}
      shadow={false}
      style={styles.latestEventCard}
    >
      <View style={styles.latestEventHeader}>
        <Text style={styles.latestEventType}>
          {getEventTypeLabel(event.type)}
        </Text>
        <Text style={styles.latestEventDate}>{formatDate(event.date)}</Text>
      </View>
      <Text numberOfLines={2} style={styles.latestEventDescription}>
        {event.description}
      </Text>
    </Card>
  );

  const LatestEventsSection = () => (
    <View style={styles.latestEventsSection}>
      <Text style={styles.sectionTitle}>Últimos Manejos</Text>
      {latestEvents.length === 0 ? (
        <Card padding={16} shadow={false} style={styles.latestEventsEmptyCard}>
          <Text style={styles.latestEventsEmptyText}>
            Nenhum manejo registrado ainda.
          </Text>
        </Card>
      ) : (
        latestEvents.map((event, index) => (
          <LatestEventCard
            key={event.id ?? `latest-event-${index}`}
            event={event}
          />
        ))
      )}
      <TouchableOpacity
        accessibilityLabel="Ver todos os manejos"
        accessibilityRole="button"
        activeOpacity={0.75}
        onPress={handleManejosPress}
        style={styles.latestEventsCta}
      >
        <Text style={styles.latestEventsCtaText}>Ver todos os manejos →</Text>
      </TouchableOpacity>
    </View>
  );

  if (farmsLoading) {
    return <Loading text="Carregando..." />;
  }

  if (farms.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
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
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
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
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Olá!</Text>
            <Text style={styles.subtitle}>
              Gerencie seu rebanho com facilidade.
            </Text>
          </View>
          <CompactProfileAccess />
        </View>

        <View style={styles.farmSelectorSection}>
          <Card
            marginBottom={0}
            padding={16}
            shadow={false}
            style={styles.activeFarmCard}
          >
            <View style={styles.activeFarmHeader}>
              <View style={styles.activeFarmTextGroup}>
                <Text style={styles.farmSelectorLabel}>Fazenda Ativa</Text>
                <Text style={styles.activeFarmName}>
                  {activeFarm?.nome ?? 'Nenhuma fazenda ativa'}
                </Text>
              </View>
              <TouchableOpacity
                accessibilityLabel="Trocar Fazenda"
                accessibilityRole="button"
                activeOpacity={0.75}
                onPress={handleFazendasPress}
                style={styles.changeFarmButton}
              >
                <Text style={styles.changeFarmText}>Trocar Fazenda</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <View style={styles.statsRow}>
            <StatCard
              label="Animais"
              onPress={handleInventarioPress}
              value={stats.animais}
              actionLabel="Ver Inventário →"
            />
            <StatCard
              label="Manejos"
              onPress={handleManejosPress}
              value={stats.manejos}
              actionLabel="Ver Manejos →"
            />
            <StatCard
              label="Fazendas"
              onPress={handleFazendasPress}
              value={stats.fazendas}
              actionLabel="Gerenciar →"
            />
          </View>
        )}

        <Button
          fullWidth
          icon={<Text style={styles.scanButtonIcon}>📸</Text>}
          style={styles.scanButton}
          onPress={handleScanPress}
          title="Escanear Novo Brinco"
        />

        <LatestEventsSection />

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsList}>
          <QuickActionCard
            label="Cadastrar Animal"
            onPress={handleCadastrarAnimalPress}
            icon="➕"
          />
          <QuickActionCard
            label="Registrar Manejo"
            onPress={handleScanPress}
            icon="📷"
          />
          <QuickActionCard
            label="Nova Fazenda"
            onPress={handleNovaFazendaPress}
            icon="🚜"
          />
        </View>
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
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  headerText: {
    flex: 1,
    paddingRight: theme.spacing.md,
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
  compactProfileButton: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: theme.sizes.chipHeight,
    paddingHorizontal: theme.spacing.md,
  },
  compactProfileText: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  farmSelectorSection: {
    marginBottom: theme.spacing.lg,
  },
  activeFarmCard: {
    backgroundColor: theme.colors.backgroundSubtle,
  },
  activeFarmHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeFarmTextGroup: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  farmSelectorLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxs,
  },
  activeFarmName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  changeFarmButton: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    minHeight: theme.sizes.chipHeight,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
  },
  changeFarmText: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
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
    minHeight: 116,
    justifyContent: 'center',
  },
  statAffordance: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
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
  latestEventsSection: {
    marginBottom: theme.spacing.xl,
  },
  latestEventCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderSoft,
  },
  latestEventHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  latestEventType: {
    color: theme.colors.primary,
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    paddingRight: theme.spacing.sm,
  },
  latestEventDate: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
  },
  latestEventDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
  },
  latestEventsEmptyCard: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.borderSoft,
  },
  latestEventsEmptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  latestEventsCta: {
    alignSelf: 'flex-end',
    minHeight: theme.sizes.chipHeight,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  latestEventsCtaText: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  quickActionsList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: theme.sizes.iconMd,
    marginRight: theme.spacing.sm,
  },
  quickActionLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  quickActionCta: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileButton: {
    marginTop: theme.spacing.md,
  },
  invitesButton: {
    marginTop: theme.spacing.lg,
  },
});
