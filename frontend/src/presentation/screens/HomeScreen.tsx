import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useHome } from '../viewmodels/useHome';
import { router } from 'expo-router';
import { Button, Card, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const HomeScreen: React.FC = () => {
  const { stats, loading, error, refresh } = useHome();

  // useFocusEffect(
  //   useCallback(() => {
  //     refresh();
  //   }, [refresh])
  // );

  const handleScanPress = () => {
    router.push({ pathname: AppRoutes.SCANNER });
  };

  const handleInventarioPress = () => {
    router.push({ pathname: AppRoutes.INVENTARIO });
  };

  const handleNovaFazendaPress = () => {
    router.push({ pathname: AppRoutes.CREATE_FAZENDA });
  };

  const StatCard = ({ label, value }: { label: string; value: number }) => (
    <Card marginBottom={0} padding={16} shadow={false} style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );

  const QuickActionCard = ({ label, onPress, icon }: { label: string; onPress: () => void; icon: string }) => (
    <Card marginBottom={0} onPress={onPress} padding={20} style={styles.quickActionCard}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Card>
  );

  if (loading && !stats.fazendas && !stats.animais) {
    return <Loading text="Carregando painel..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} colors={[theme.colors.primary]} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Olá!</Text>
          <Text style={styles.subtitle}>Gerencie seu rebanho com facilidade.</Text>
        </View>

        <Button 
          fullWidth
          icon={<Text style={styles.scanButtonIcon}>📸</Text>}
          style={styles.scanButton}
          onPress={handleScanPress}
          title="Escanear Novo Brinco"
        />

        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <View style={styles.quickActionsRow}>
            <StatCard label="Animais" value={stats.animais} />
            <StatCard label="Manejos" value={stats.manejos} />
            <StatCard label="Fazendas" value={stats.fazendas} />
          </View>
          
          
        )}

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionCard 
            label="Inventário" 
            onPress={handleInventarioPress}
            icon="📋"
          />
          <QuickActionCard 
            label="Nova Fazenda" 
            onPress={handleNovaFazendaPress}
            icon="🚜"
          />
        </View>

        <Button 
          fullWidth
          onPress={() => router.push({ pathname: AppRoutes.FAZENDAS })}
          style={styles.secondaryButton}
          title="Ver Todas as Fazendas"
          variant="secondary"
        />
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
  },
  header: {
    marginBottom: theme.spacing.xl,
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
  scanButton: {
    marginBottom: theme.spacing.xl,
  },
  scanButtonIcon: {
    fontSize: theme.sizes.iconSm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.successSoft,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xxs,
    borderColor: theme.colors.transparent,
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
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs - 2,
  },
  quickActionIcon: {
    fontSize: theme.sizes.iconMd,
    marginBottom: theme.spacing.xs,
  },
  quickActionLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  secondaryButton: {
    marginTop: theme.spacing.sm,
  },
});
