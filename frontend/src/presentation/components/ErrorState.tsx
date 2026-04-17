import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { theme } from '../../core/theme';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  retryText = 'Tentar novamente',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Algo saiu do esperado</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button
          fullWidth
          onPress={onRetry}
          style={styles.button}
          title={retryText}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 21,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
