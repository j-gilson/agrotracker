import React, { useCallback, useRef, useState } from 'react';
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
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { router, useFocusEffect } from 'expo-router';
import { Button, Card, EmptyState, Loading, PageHeader, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { refreshOnReturn } from '../navigation/refreshOnReturn';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const FazendaListScreen: React.FC = () => {
  const { farms: fazendas, activeFarmId, loading, setActiveFarm, refreshFarms: refresh } = useActiveFarm();
  const { showSnackbar } = useSnackbar();
  const hasFocusedOnceRef = useRef(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshOnReturn(hasFocusedOnceRef, refresh);
    }, [refresh])
  );

  const handleFazendaPress = (fazendaId: string) => {
    router.push({
      pathname: AppRoutes.ANIMAL_LIST,
      params: { fazendaId },
    });
  };

  const handleManejosPress = async (fazendaId: string) => {
    await setActiveFarm(fazendaId);
    router.push({ pathname: AppRoutes.MANEJOS });
  };

  const handleSelectFarm = async (fazendaId: string) => {
    if (selectingId) return;
    setSelectingId(fazendaId);
    try {
      await setActiveFarm(fazendaId);
      showSnackbar({ message: 'Fazenda Ativa atualizada com sucesso.', variant: 'success' });
    } catch {
      showSnackbar({ message: 'Não foi possível atualizar a Fazenda Ativa.', variant: 'error' });
    } finally {
      setSelectingId(null);
    }
  };

  const renderItem = ({ item }: { item: Fazenda }) => {
    const isActive = item.id != null && item.id === activeFarmId;

    return (
      <View style={styles.fazendaItem}>
        <Card
          accessibilityLabel={
            isActive
              ? `${item.nome}. Fazenda Ativa.`
              : `Abrir fazenda ${item.nome}`
          }
          accessibilityState={isActive ? { selected: true } : undefined}
          onPress={() => item.id && handleFazendaPress(item.id)}
          style={[styles.card, isActive && styles.cardActive]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.fazendaName}>{item.nome}</Text>
            {isActive ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Fazenda Ativa</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.fazendaLocation}>📍 {item.localizacao}</Text>
          </View>
          <Text style={styles.cardCta}>Abrir Fazenda &gt;</Text>
        </Card>
        <View style={styles.actionsRow}>
          {item.id ? (
            <Button
              onPress={() => handleManejosPress(item.id as string)}
              title="Ver Manejos"
              variant="ghost"
              style={styles.manejosButton}
            />
          ) : null}
          {item.id && !isActive ? (
            <Button
              accessibilityLabel={`Selecionar ${item.nome} como Fazenda Ativa.`}
              disabled={selectingId !== null}
              loading={selectingId === item.id}
              onPress={() => handleSelectFarm(item.id as string)}
              title="Selecionar"
              variant="secondary"
              style={styles.selectButton}
            />
          ) : null}
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      buttonText="Nova Fazenda"
      onPress={() => router.push({ pathname: AppRoutes.CREATE_FAZENDA })}
      subtitle="Registre uma propriedade rural para começar a organizar seus animais."
      title="Nenhuma fazenda encontrada"
    />
  );

  if (loading && fazendas.length === 0) {
    return <Loading text="Carregando fazendas..." variant="list" />;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <PageHeader
        title="Minhas Fazendas"
        variant="banner"
        rightAction={
          <Button
            onPress={() => router.push({ pathname: AppRoutes.CREATE_FAZENDA })}
            style={styles.headerButton}
            title="Nova Fazenda"
            variant="secondary"
          />
        }
      />

      <FlatList
        data={fazendas}
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
  headerButton: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.sm,
  },
  listContainer: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  card: {
    borderColor: theme.colors.border,
  },
  cardActive: {
    borderColor: theme.colors.primary,
  },
  fazendaItem: {
    marginBottom: theme.spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xxs,
  },
  manejosButton: {
    minHeight: 40,
  },
  selectButton: {
    minHeight: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
    paddingBottom: theme.spacing.xs,
  },
  fazendaName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight,
    marginLeft: theme.spacing.sm,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fazendaLocation: {
    fontSize: theme.typography.fontSize.sm + 1,
    color: theme.colors.textSecondary,
  },
  cardCta: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textAccent,
    textAlign: 'right',
  },
});
