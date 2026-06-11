import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useManejos } from '../viewmodels/useManejos';
import { router, useFocusEffect } from 'expo-router';
import { Event } from '../../domain/events/entities/Event';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { formatDate } from '../../core/utils/formatDate';

export const ManejosScreen: React.FC = () => {
  const { fazendas, selectedFazendaId, setSelectedFazendaId, events, loading, error, refresh } = useManejos();
  const hasFocusedOnceRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }

      refresh();
    }, [refresh])
  );

  const renderManejoItem = ({ item }: { item: Event }) => (
    <Card
      marginBottom={16}
      onPress={() => router.push(AppRoutes.ANIMAL_DETAIL(item.animalId))}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.date)} {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.animalIdText}>Animal ID: {item.animalId}</Text>
        <Text style={styles.obsText} numberOfLines={2}>
          💬 {item.description}
        </Text>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyState
      subtitle="Registre um manejo para começar a preencher o histórico."
      title="Nenhum manejo encontrado."
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manejos</Text>
        <Text style={styles.subtitle}>Histórico de atividades recentes</Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Fazenda:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fazendaList}>
          {fazendas.map((f) => (
            <Card
              key={f.id}
              onPress={() => setSelectedFazendaId(f.id || null)}
              padding={0}
              shadow={false}
              style={[
                styles.fazendaChip,
                selectedFazendaId === f.id && styles.fazendaChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.fazendaChipText,
                  selectedFazendaId === f.id && styles.fazendaChipTextSelected,
                ]}
              >
                {f.nome}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      {loading && events.length === 0 ? (
        <Loading text="Carregando manejos..." variant="list" />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={renderManejoItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} colors={[theme.colors.primary]} />
          }
        />
      )}

      <Button
        onPress={() =>
          router.push(AppRoutes.SCANNER_WITH_FAZENDA(selectedFazendaId))
        }
        style={styles.fab}
        title="Novo Manejo"
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
    paddingBottom: 100,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm - 2,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.sm - 2,
  },
  typeText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xs,
  },
  dateText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
  },
  cardContent: {
    gap: 4,
  },
  animalIdText: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xxs,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  obsText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xxs,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
