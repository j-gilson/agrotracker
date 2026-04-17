import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../core/theme';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

interface LoadingProps {
  text?: string;
  variant?: 'spinner' | 'list' | 'form' | 'detail';
}

export const Loading: React.FC<LoadingProps> = ({ text, variant = 'spinner' }) => {
  if (variant === 'list') {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={`list-skeleton-${index}`} marginBottom={theme.spacing.md} style={styles.skeletonCard}>
            <Skeleton height={20} width="45%" />
            <Skeleton height={14} style={styles.skeletonSpacing} width="70%" />
            <Skeleton height={14} width="55%" />
          </Card>
        ))}
      </View>
    );
  }

  if (variant === 'form') {
    return (
      <View style={styles.skeletonContainer}>
        <Card style={styles.skeletonCard}>
          <Skeleton height={16} width="35%" />
          <Skeleton height={52} style={styles.skeletonSpacing} />
          <Skeleton height={16} style={styles.skeletonSection} width="30%" />
          <Skeleton height={52} style={styles.skeletonSpacing} />
          <Skeleton height={52} style={styles.skeletonSection} />
        </Card>
      </View>
    );
  }

  if (variant === 'detail') {
    return (
      <View style={styles.skeletonContainer}>
        <Skeleton height={28} width="52%" />
        <Skeleton height={16} style={styles.skeletonSpacing} width="35%" />
        <Card style={styles.detailCard}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`detail-skeleton-${index}`}
              height={18}
              style={index < 3 ? styles.skeletonRow : undefined}
              width="100%"
            />
          ))}
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  skeletonContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  skeletonCard: {
    borderColor: theme.colors.borderSoft,
  },
  skeletonSpacing: {
    marginTop: theme.spacing.sm,
  },
  skeletonSection: {
    marginTop: theme.spacing.lg,
  },
  detailCard: {
    marginTop: theme.spacing.lg,
    borderColor: theme.colors.borderSoft,
  },
  skeletonRow: {
    marginBottom: theme.spacing.md,
  },
  text: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm + 1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
