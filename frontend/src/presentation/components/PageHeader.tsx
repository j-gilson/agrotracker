import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../core/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
  variant?: 'default' | 'banner';
  hideBackButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  rightAction,
  onBackPress,
  variant = 'default',
  hideBackButton = false,
}) => {
  const handleBack = onBackPress ?? (() => router.back());

  const isBanner = variant === 'banner';

  return (
    <View style={[styles.container, isBanner && styles.bannerContainer]}>
      <View style={styles.topRow}>
        {!hideBackButton && (
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={handleBack}
            style={styles.backButton}
          >
            <Text style={[styles.backArrow, isBanner && styles.bannerText]}>
              ←
            </Text>
            <Text style={[styles.backLabel, isBanner && styles.bannerText]}>
              Voltar
            </Text>
          </Pressable>
        )}
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>

      <Text style={[styles.title, isBanner && styles.bannerTitle]}>
        {title}
      </Text>

      {subtitle && (
        <Text style={[styles.subtitle, isBanner && styles.bannerSubtitle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: 'transparent',
  },
  bannerContainer: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: theme.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingRight: theme.spacing.md,
  },
  backArrow: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textAccent,
    fontWeight: theme.typography.fontWeight.bold,
    marginRight: theme.spacing.xxs,
  },
  backLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textAccent,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  rightAction: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  bannerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.textInverse,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  bannerSubtitle: {
    color: theme.colors.overlaySoft,
  },
  bannerText: {
    color: theme.colors.textInverse,
  },
});
