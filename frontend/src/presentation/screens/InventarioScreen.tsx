import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { useInventario } from '../viewmodels/useInventario';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { router, useFocusEffect } from 'expo-router';
import { Animal } from '../../domain/entities/Animal';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { formatWeight } from '../../core/utils/formatWeight';
import { maskUuid } from '../../core/utils/maskUuid';
import { refreshOnReturn } from '../navigation/refreshOnReturn';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const InventarioScreen: React.FC = () => {
  const { activeFarmId, activeFarm, loading: farmsLoading } = useActiveFarm();
  const { animals, loading, error, refresh } = useInventario(activeFarmId);
  const hasFocusedOnceRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      refreshOnReturn(hasFocusedOnceRef, refresh);
    }, [refresh])
  );

  const handleCreateAnimal = () => {
    if (!activeFarmId) return;

    router.push({
      pathname: AppRoutes.CREATE_ANIMAL,
      params: {
        fazendaId: activeFarmId,
      },
    });
  };

  const renderAnimalItem = ({ item }: { item: Animal }) => (
    <Card
      onPress={() => {
        if (!item.id) return;
        router.push(AppRoutes.ANIMAL_DETAIL(item.id));
      }}
      style={styles.animalCard}
      marginBottom={12}
    >
      <View style={styles.animalInfo}>
        <Text style={styles.animalName}>
          {item.nome || item.codigoIdentificacao}
        </Text>
        <Text style={styles.animalDetails}>
          {item.raca} • {formatWeight(item.peso)}
        </Text>
        <Text style={styles.animalCode}>
          {item.codigoIdentificacao} • {item.status}
        </Text>
      </View>

      <View style={styles.animalMeta}>
        <Text style={styles.animalId}>ID: {maskUuid(item.id)}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyState
      subtitle={
        activeFarmId
          ? 'Cadastre um animal nesta fazenda para preencher o inventário.'
          : 'Escolha uma fazenda para visualizar o rebanho correspondente.'
      }
      title={
        activeFarmId
          ? 'Nenhum animal cadastrado nesta fazenda.'
          : 'Selecione uma fazenda para ver o inventário.'
      }
    />
  );

  if (farmsLoading) {
    return <Loading text="Carregando..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventário</Text>
        <Text style={styles.subtitle}>
          {activeFarm
            ? `Rebanho de ${activeFarm.nome}`
            : 'Listagem completa do rebanho'}
        </Text>
      </View>

      {loading && animals.length === 0 ? (
        <Loading text="Carregando inventário..." variant="list" />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={animals}
          keyExtractor={(item, index) =>
            item.id ?? index.toString()
          }
          renderItem={renderAnimalItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      <Button
        onPress={handleCreateAnimal}
        disabled={!activeFarmId}
        style={[
          styles.fab,
          !activeFarmId && styles.fabDisabled,
        ]}
        title={
          activeFarmId
            ? 'Novo Animal'
            : 'Selecione Fazenda'
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },

  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },

  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },

  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 90,
  },

  animalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },

  animalInfo: {
    flex: 1,
  },

  animalName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  animalDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  animalCode: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  animalMeta: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  animalId: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.xs,
  },

  chevron: {
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.textMuted,
  },

  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    elevation: 5,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  fabDisabled: {
    opacity: 0.6,
  },
});
