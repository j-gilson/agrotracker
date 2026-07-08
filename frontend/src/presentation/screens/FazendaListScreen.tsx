import React, { useCallback, useRef } from 'react';
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
import { Button, Card, EmptyState, Loading, PageHeader } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { refreshOnReturn } from '../navigation/refreshOnReturn';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const FazendaListScreen: React.FC = () => {
  const { farms: fazendas, loading, setActiveFarm, refreshFarms: refresh } = useActiveFarm();
  const hasFocusedOnceRef = useRef(false);

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

  const renderItem = ({ item }: { item: Fazenda }) => (
    <View style={styles.fazendaItem}>
      <Card
        accessibilityLabel={`Abrir fazenda ${item.nome}`}
        onPress={() => item.id && handleFazendaPress(item.id)}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.fazendaName}>{item.nome}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.fazendaLocation}>📍 {item.localizacao}</Text>
        </View>
        <Text style={styles.cardCta}>Abrir Fazenda &gt;</Text>
      </Card>
      {item.id ? (
        <Button
          onPress={() => handleManejosPress(item.id as string)}
          title="Ver Manejos"
          variant="ghost"
          style={styles.manejosButton}
        />
      ) : null}
    </View>
  );

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
  fazendaItem: {
    marginBottom: theme.spacing.md,
  },
  manejosButton: {
    alignSelf: 'flex-end',
    minHeight: 40,
    marginTop: theme.spacing.xxs,
  },
  cardHeader: {
    marginBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
    paddingBottom: theme.spacing.xs,
  },
  fazendaName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
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
