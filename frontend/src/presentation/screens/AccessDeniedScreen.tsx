import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Card } from '../components';
import { theme } from '../../core/theme';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const AccessDeniedScreen: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <Card padding={20} shadow style={styles.card}>
        <Text style={styles.title}>Acesso restrito</Text>
        <Text style={styles.subtitle}>
          {message ?? 'Você não tem permissão para acessar esta área.'}
        </Text>
        <Button fullWidth onPress={() => router.back()} title="Voltar" />
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
});

