import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useAnimals } from '../viewmodels/useAnimals';
import { Animal } from '../../domain/entities/Animal';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const AnimalListScreen: React.FC = () => {
  const { fazendaId } = useLocalSearchParams();
  const { animals, loading, error, refresh } = useAnimals(fazendaId as string);

  // 🔥 Atualiza sempre que voltar pra tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const renderItem = ({ item }: { item: Animal }) => (
    <Card marginBottom={12} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.animalName}>{item.nome}</Text>
        <Text style={styles.animalRaca}>{item.raca}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.animalInfo}>Idade: {item.idade} anos</Text>
        <Text style={styles.animalInfo}>Peso: {item.peso} kg</Text>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyState
      buttonText="Cadastrar primeiro animal"
      onPress={() =>
        router.push({
          pathname: AppRoutes.CREATE_ANIMAL,
          params: { fazendaId },
        })
      }
      subtitle="Cadastre o primeiro animal desta fazenda para começar a organizar o rebanho."
      title="Nenhum animal encontrado."
    />
  );

  if (loading && animals.length === 0) {
    return <Loading text="Carregando rebanho..." variant="list" />;
  }

  if (error && animals.length === 0) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Meu Rebanho</Text>
          <Button
            onPress={() => router.push({
              pathname: AppRoutes.CREATE_ANIMAL,
              params: { fazendaId }
            })}
            style={styles.addButton}
            title="+ Novo"
            variant="secondary"
          />
        </View>
      </View>

      <FlatList
        data={animals}
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
  addButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderColor: theme.colors.transparent,
  },
  listContainer: {
    padding: theme.spacing.sm - 2,
    flexGrow: 1,
  },
  card: {
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
    paddingBottom: theme.spacing.xs,
  },
  animalName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  animalRaca: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  animalInfo: {
    fontSize: theme.typography.fontSize.sm + 1,
    color: theme.colors.textPrimary,
  },
});
