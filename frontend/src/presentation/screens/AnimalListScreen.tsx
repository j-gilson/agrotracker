import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import React, { useCallback } from 'react';
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
import { useAnimals } from '../viewmodels/useAnimals';
import { Animal } from '../../domain/entities/Animal';
import { Button, Card, EmptyState, ErrorState, Loading, PageHeader } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { usePermissions } from '../../core/auth/usePermissions';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const AnimalListScreen: React.FC = () => {
  const { fazendaId } = useLocalSearchParams();
  const fazendaIdValue =
    typeof fazendaId === 'string' ? fazendaId : Array.isArray(fazendaId) ? fazendaId[0] : '';
  const { animals, loading, error, refresh } = useAnimals(fazendaIdValue);
  const { canViewMembers } = usePermissions(fazendaIdValue);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!fazendaIdValue) {
    return <ErrorState message="Parâmetro obrigatório não informado: fazendaId." />;
  }

  const renderItem = ({ item }: { item: Animal }) => (
    <Card
      marginBottom={12}
      onPress={() => router.push(AppRoutes.ANIMAL_DETAIL(item.id))}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.animalName}>
            {item.nome || item.codigoIdentificacao}
          </Text>
          <Text style={styles.animalCode}>{item.codigoIdentificacao}</Text>
        </View>
        <Text style={styles.animalStatus}>{item.status}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.animalInfo}>Idade: {item.idade} anos</Text>
        <Text style={styles.animalInfo}>Peso: {item.peso} kg</Text>
        <Text style={styles.animalInfo}>Raça: {item.raca}</Text>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyState
      buttonText="Cadastrar primeiro animal"
      onPress={() =>
        router.push({
          pathname: AppRoutes.CREATE_ANIMAL,
          params: { fazendaId: fazendaIdValue },
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
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <PageHeader
        title="Meu Rebanho"
        variant="banner"
        rightAction={
          <View style={styles.headerActions}>
            {canViewMembers ? (
              <Button
                onPress={() =>
                  router.push({
                    pathname: AppRoutes.FAZENDA_TEAM,
                    params: { fazendaId: fazendaIdValue },
                  } as unknown as Href)
                }
                accessibilityLabel="Gerenciar equipe da fazenda"
                style={styles.teamButton}
                title="Equipe"
                variant="secondary"
              />
            ) : null}
            <Button
              onPress={() =>
                router.push({
                  pathname: AppRoutes.CREATE_ANIMAL,
                  params: { fazendaId: fazendaIdValue },
                })
              }
              style={styles.addButton}
              title="+ Novo"
              variant="secondary"
            />
          </View>
        }
      />

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  teamButton: {
    minHeight: 40,
    paddingHorizontal: 14,
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
  animalCode: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  animalStatus: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  cardContent: {
    gap: theme.spacing.xxs,
    justifyContent: 'space-between',
  },
  animalInfo: {
    fontSize: theme.typography.fontSize.sm + 1,
    color: theme.colors.textPrimary,
  },
});
