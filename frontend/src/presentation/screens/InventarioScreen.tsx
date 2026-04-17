import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useInventario } from '../viewmodels/useInventario';
import { router, useFocusEffect } from 'expo-router';
import { Animal } from '../../domain/entities/Animal';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { formatWeight } from '../../core/utils/formatWeight';
import { maskUuid } from '../../core/utils/maskUuid';

export const InventarioScreen: React.FC = () => {
  const {
    animals,
    fazendas,
    selectedFazendaId,
    setSelectedFazendaId,
    loading,
    error,
    refresh,
  } = useInventario();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleCreateAnimal = () => {
    if (!selectedFazendaId) {
      return;
    }

    router.push({
      pathname: AppRoutes.CREATE_ANIMAL,
      params: {
        fazendaId: selectedFazendaId,
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
        <Text style={styles.animalName}>{item.nome}</Text>
        <Text style={styles.animalDetails}>
          {item.raca} • {formatWeight(item.peso)}
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
        selectedFazendaId
          ? 'Cadastre um animal nesta fazenda para preencher o inventário.'
          : 'Escolha uma fazenda para visualizar o rebanho correspondente.'
      }
      title={
        selectedFazendaId
          ? 'Nenhum animal cadastrado nesta fazenda.'
          : 'Selecione uma fazenda para ver o inventário.'
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventário</Text>
        <Text style={styles.subtitle}>Listagem completa do rebanho</Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Fazenda:</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fazendaList}
        >
          {fazendas.map((f) => (
            <Card
              key={f.id}
              onPress={() => setSelectedFazendaId(f.id || null)}
              padding={0}
              shadow={false}
              style={[
                styles.fazendaChip,
                selectedFazendaId === f.id &&
                  styles.fazendaChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.fazendaChipText,
                  selectedFazendaId === f.id &&
                    styles.fazendaChipTextSelected,
                ]}
              >
                {f.nome}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      {loading && animals.length === 0 ? (
        <Loading
          text="Carregando inventário..."
          variant="list"
        />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
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
        disabled={!selectedFazendaId}
        style={[
          styles.fab,
          !selectedFazendaId && styles.fabDisabled,
        ]}
        title={
          selectedFazendaId
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

  filterContainer: {
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },

  filterLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },

  fazendaList: {
    paddingLeft: theme.spacing.lg,
  },

  fazendaChip: {
    minHeight: 0,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.backgroundMuted,
    marginRight: theme.spacing.sm - 2,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },

  fazendaChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  fazendaChipText: {
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  fazendaChipTextSelected: {
    color: theme.colors.textInverse,
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