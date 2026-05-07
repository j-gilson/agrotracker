import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Card } from '../components';
import { theme } from '../../core/theme';

export const AccessDeniedScreen: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Card padding={20} shadow style={styles.card}>
        <Text style={styles.title}>Acesso restrito</Text>
        <Text style={styles.subtitle}>
          {message ?? 'Você não tem permissão para acessar esta área.'}
        </Text>
        <Button fullWidth onPress={() => router.back()} title="Voltar" />
      </Card>
    </View>
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

