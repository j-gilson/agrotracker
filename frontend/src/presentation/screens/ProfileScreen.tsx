import React from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { theme } from '../../core/theme';
import { Button, Card } from '../components';
import { useAuthSession } from '../contexts/AuthContext';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const navigateToInvites = (
  navigate: () => void = () =>
    router.push({ pathname: AppRoutes.INVITES })
) => {
  navigate();
};

export const executeLogout = async (logout: () => Promise<void>) => {
  await logout();
};

export const getUserInitials = (name?: string | null): string => {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length === 0) return '--';

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
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
  const userName = user?.nome ?? 'Não informado';
  const userEmail = user?.email ?? 'Não informado';

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
          <Text style={styles.subtitle}>Gerencie sua conta e acesso</Text>
        </View>

        <Card padding={24} style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getUserInitials(user?.nome)}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONTA</Text>
          <Button
            fullWidth
            onPress={() => navigateToInvites()}
            title="Meus Convites →"
            variant="secondary"
          />
        </View>

        <View style={[styles.section, styles.sessionSection]}>
          <Text style={styles.sectionLabel}>SESSÃO</Text>
          <Button
            fullWidth
            onPress={() => confirmLogout(logout)}
            title="Sair"
            variant="danger"
          />
        </View>
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
  identityCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    height: theme.sizes.fabSize,
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    width: theme.sizes.fabSize,
  },
  avatarText: {
    color: theme.colors.primaryDark,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  userName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.xxs,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sessionSection: {
    marginTop: theme.spacing.md,
  },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
});
