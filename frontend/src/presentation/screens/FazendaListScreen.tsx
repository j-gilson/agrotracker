import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useFazendas } from '../viewmodels/useFazendas';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { router, useFocusEffect, type Href } from 'expo-router';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { useActiveFarm } from '../contexts/ActiveFarmContext';

export const FazendaListScreen: React.FC = () => {
  const { fazendas, loading, error, refresh } = useFazendas();
  const { setActiveFarm } = useActiveFarm();

  useFocusEffect(
    useCallback(() => {
      refresh();
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
        onPress={() => item.id && handleFazendaPress(item.id)}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.fazendaName}>{item.nome}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.fazendaLocation}>📍 {item.localizacao}</Text>
        </View>
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
      buttonText="Cadastrar primeira fazenda"
      onPress={() => router.push({ pathname: AppRoutes.CREATE_FAZENDA })}
      subtitle="Registre uma propriedade rural para começar a organizar seus animais."
      title="Nenhuma fazenda encontrada."
    />
  );

  if (loading && fazendas.length === 0) {
    return <Loading text="Carregando fazendas..." variant="list" />;
  }

  if (error && fazendas.length === 0) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Minhas Fazendas</Text>
          <View style={styles.headerActions}>
            <Button
              onPress={() =>
                router.push({
                  pathname: AppRoutes.INVITES,
                } as unknown as Href)
              }
              style={styles.headerButton}
              title="Convites"
              variant="ghost"
            />
            <Button
              onPress={() => router.push({ pathname: AppRoutes.CREATE_FAZENDA })}
              style={styles.headerButton}
              title="+ Novo"
              variant="secondary"
            />
          </View>
        </View>
      </View>

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
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: theme.spacing.sm - 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  headerButton: {
    minHeight: 40,
    paddingHorizontal: 12,
  },
  listContainer: {
    padding: theme.spacing.sm - 2,
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
});
