import React, { useCallback, useRef, useState } from 'react';
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
import { Card, EmptyState, ErrorState, Loading } from '../components';
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
  const [areasExpanded, setAreasExpanded] = useState(false);

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
      pathname: AppRoutes.ANIMAL_LIST,
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

  const handleAreasPress = () => {
    setAreasExpanded((prev) => !prev);
  };

  const handleContaPress = () => {
    router.push(AppRoutes.PROFILE as unknown as Href);
  };

  const handleEquipePress = () => {
    if (!activeFarmId) return;
    router.push({
      pathname: AppRoutes.FAZENDA_TEAM,
      params: { fazendaId: activeFarmId },
    } as unknown as Href);
  };

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
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityRole="button"
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.quickActionCard}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const AreasItemCard = ({
    label,
    description,
    onPress,
    icon,
  }: {
    label: string;
    description: string;
    onPress: () => void;
    icon: string;
  }) => (
    <Card
      accessibilityLabel={`Abrir ${label}`}
      marginBottom={0}
      onPress={onPress}
      padding={14}
      shadow={false}
      style={styles.areasItemCard}
    >
      <Text style={styles.areasItemIcon}>{icon}</Text>
      <View style={styles.areasItemText}>
        <Text style={styles.areasItemLabel}>{label}</Text>
        <Text style={styles.areasItemDescription}>{description}</Text>
      </View>
      <Text style={styles.areasItemCta}>→</Text>
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
      <Text style={styles.sectionTitle}>Atividades Recentes</Text>
      {latestEvents.length === 0 ? (
        <EmptyState
          subtitle="Os manejos registrados aparecerão aqui."
          title="Nenhum manejo registrado ainda"
          buttonText="Identificar para Manejo"
          onPress={handleScanPress}
        />
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
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Bem-vindo!</Text>
              <Text style={styles.subtitle}>
                Comece cadastrando sua primeira fazenda.
              </Text>
            </View>
            <TouchableOpacity
              accessibilityLabel="Conta"
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={handleContaPress}
              style={styles.contaButton}
            >
              <View style={styles.contaAvatar}>
                <Text style={styles.contaAvatarText}>👤</Text>
              </View>
              <Text style={styles.contaLabel}>Conta</Text>
            </TouchableOpacity>
          </View>
          <Card shadow={false}>
            <EmptyState
              title="Nenhuma fazenda cadastrada"
              subtitle="Cadastre sua primeira fazenda para visualizar indicadores reais do sistema."
              buttonText="Nova Fazenda"
              onPress={handleNovaFazendaPress}
            />
          </Card>
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
          <TouchableOpacity
            accessibilityLabel="Conta"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={handleContaPress}
            style={styles.contaButton}
          >
            <View style={styles.contaAvatar}>
              <Text style={styles.contaAvatarText}>👤</Text>
            </View>
            <Text style={styles.contaLabel}>Conta</Text>
          </TouchableOpacity>
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
                accessibilityLabel="Abrir Minhas Fazendas"
                accessibilityRole="button"
                activeOpacity={0.75}
                onPress={handleFazendasPress}
                style={styles.changeFarmButton}
              >
                <Text style={styles.changeFarmText}>Minhas Fazendas</Text>
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
              actionLabel="Meu Rebanho →"
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
              actionLabel="Minhas Fazendas →"
            />
          </View>
        )}

        {!error && activeFarmId && stats.animais === 0 ? (
          <Card
            marginBottom={theme.spacing.lg}
            padding={16}
            shadow={false}
            style={styles.guidanceCard}
          >
            <Text style={styles.guidanceTitle}>Rebanho vazio</Text>
            <Text style={styles.guidanceText}>
              Comece cadastrando ou identificando um animal.
            </Text>
          </Card>
        ) : null}

        <View style={styles.areasSection}>
          <Card
            accessibilityLabel={areasExpanded ? 'Recolher Áreas da Fazenda' : 'Abrir Áreas da Fazenda'}
            marginBottom={0}
            onPress={handleAreasPress}
            padding={16}
            shadow={false}
            style={styles.areasCard}
          >
            <Text style={styles.areasIcon}>📋</Text>
            <View style={styles.areasText}>
              <Text style={styles.areasLabel}>Áreas da Fazenda</Text>
              <Text style={styles.areasDescription}>
                Rebanho, identificação, manejos e equipe
              </Text>
            </View>
            <Text style={styles.areasCta}>
              {areasExpanded ? '▾' : '▸'}
            </Text>
          </Card>
          {areasExpanded && (
            <View style={styles.areasItemsList}>
              <AreasItemCard
                label="Meu Rebanho"
                description="Visualizar rebanho da fazenda ativa"
                onPress={handleInventarioPress}
                icon="🐄"
              />
              <AreasItemCard
                label="Identificar Animal"
                description="Ler QR Code ou informar o número identificador"
                onPress={handleScanPress}
                icon="📸"
              />
              <AreasItemCard
                label="Manejos"
                description="Acompanhar manejos e histórico"
                onPress={handleManejosPress}
                icon="🗓️"
              />
              <AreasItemCard
                label="Equipe"
                description="Ver membros da fazenda ativa"
                onPress={handleEquipePress}
                icon="👥"
              />
            </View>
          )}
        </View>

        <LatestEventsSection />

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            label="Novo Animal"
            onPress={handleCadastrarAnimalPress}
            icon="➕"
          />
          <QuickActionCard
            label="Identificar para Manejo"
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
    paddingBottom: theme.spacing.xxxl,
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
  contaButton: {
    alignItems: 'center',
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
  contaAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contaAvatarText: {
    fontSize: 16,
  },
  contaLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textAccent,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: 2,
    textAlign: 'center',
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
  guidanceCard: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.borderSoft,
  },
  guidanceTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xxs,
  },
  guidanceText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
  },
  areasSection: {
    marginBottom: theme.spacing.lg,
  },
  areasCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderSoft,
    flexDirection: 'row',
  },
  areasIcon: {
    fontSize: theme.sizes.iconMd,
    marginRight: theme.spacing.sm,
  },
  areasText: {
    flex: 1,
  },
  areasLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  areasDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.sm,
    marginTop: theme.spacing.xxs,
  },
  areasCta: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  areasItemsList: {
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  areasItemCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.borderSoft,
    flexDirection: 'row',
  },
  areasItemIcon: {
    fontSize: theme.sizes.iconMd,
    marginRight: theme.spacing.sm,
  },
  areasItemText: {
    flex: 1,
  },
  areasItemLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  areasItemDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.sm,
    marginTop: theme.spacing.xxs,
  },
  areasItemCta: {
    color: theme.colors.textAccent,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
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
  quickActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surfaceAlt,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    minWidth: 44,
  },
  quickActionIcon: {
    fontSize: theme.sizes.iconMd,
    marginBottom: theme.spacing.xxs,
  },
  quickActionLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});
