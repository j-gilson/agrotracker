import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useManejos } from '../viewmodels/useManejos';
import { router } from 'expo-router';
import { Evento } from '../../domain/entities/Evento';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { formatDate } from '../../core/utils/formatDate';

export const ManejosScreen: React.FC = () => {
  const { manejos, loading, error, refresh } = useManejos();

  const renderManejoItem = ({ item }: { item: Evento }) => (
    <Card
      marginBottom={16}
      onPress={() => router.push(AppRoutes.ANIMAL_DETAIL(item.animalId))}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.tipoEvento}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.dataHora)} {item.dataHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.animalIdText}>Animal ID: {item.animalId}</Text>
        {item.pesoKg ? <Text style={styles.infoText}>⚖️ Peso: {item.pesoKg} Kg</Text> : null}
        {item.vacina ? <Text style={styles.infoText}>💉 Vacina: {item.vacina}</Text> : null}
        {item.observacoes ? (
          <Text style={styles.obsText} numberOfLines={2}>
            💬 {item.observacoes}
          </Text>
        ) : null}
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyState
      subtitle="Os eventos de manejo mais recentes aparecerão aqui assim que a integração estiver ativa."
      title="Nenhum manejo registrado recentemente."
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manejos</Text>
        <Text style={styles.subtitle}>Histórico de atividades recentes</Text>
      </View>

      {loading && manejos.length === 0 ? (
        <Loading text="Carregando manejos..." variant="list" />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={manejos}
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
        onPress={() => router.push({ pathname: AppRoutes.SCANNER })}
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
