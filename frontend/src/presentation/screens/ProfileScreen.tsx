import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { theme } from '../../core/theme';
import { Button, Card } from '../components';
import { useAuthSession } from '../contexts/AuthContext';

export const navigateToInvites = (
  navigate: () => void = () =>
    router.push({ pathname: AppRoutes.INVITES })
) => {
  navigate();
};

export const executeLogout = async (logout: () => Promise<void>) => {
  await logout();
};

export const confirmLogout = (
  logout: () => Promise<void>,
  showAlert: typeof Alert.alert = Alert.alert
) => {
  showAlert('Sair da conta', 'Deseja realmente sair da sua conta?', [
    {
      text: 'Cancelar',
      style: 'cancel',
    },
    {
      text: 'Sair',
      style: 'destructive',
      onPress: () => {
        void executeLogout(logout);
      },
    },
  ]);
};

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthSession();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
          <Text style={styles.subtitle}>Informações da sua conta</Text>
        </View>

        <Card padding={20} style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.nome ?? 'Não informado'}</Text>

          <Text style={[styles.label, styles.spacedLabel]}>E-mail</Text>
          <Text style={styles.value}>{user?.email ?? 'Não informado'}</Text>
        </Card>

        <Button
          fullWidth
          onPress={() => navigateToInvites()}
          title="Meus Convites"
          variant="secondary"
        />
        <Button
          fullWidth
          onPress={() => confirmLogout(logout)}
          style={styles.logoutButton}
          title="Sair"
          variant="danger"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
  },
  content: {
    flex: 1,
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
    marginTop: theme.spacing.xxs,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  spacedLabel: {
    marginTop: theme.spacing.lg,
  },
  value: {
    marginTop: theme.spacing.xxs,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
});
