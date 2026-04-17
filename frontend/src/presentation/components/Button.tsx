import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../../core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const palette = {
  primary: theme.colors.primary,
  primaryPressed: theme.colors.primaryDark,
  primaryDisabled: theme.colors.primaryDisabled,
  secondary: theme.colors.surface,
  secondaryPressed: theme.colors.successSoft,
  danger: theme.colors.danger,
  dangerPressed: theme.colors.dangerStrong,
  ghostPressed: theme.colors.successSoft,
  textPrimary: theme.colors.textInverse,
  textSecondary: theme.colors.textAccent,
  textDanger: theme.colors.textInverse,
  textGhost: theme.colors.textAccent,
  border: theme.colors.border,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;
  const showBorder = variant === 'secondary' || variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        showBorder && styles.bordered,
        pressed && !isDisabled && variant === 'primary' && styles.primaryPressed,
        pressed && !isDisabled && variant === 'secondary' && styles.secondaryPressed,
        pressed && !isDisabled && variant === 'danger' && styles.dangerPressed,
        pressed && !isDisabled && variant === 'ghost' && styles.ghostPressed,
        isDisabled && variant === 'primary' && styles.primaryDisabled,
        isDisabled && variant === 'secondary' && styles.secondaryDisabled,
        isDisabled && variant === 'danger' && styles.dangerDisabled,
        isDisabled && variant === 'ghost' && styles.ghostDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'ghost' ? palette.textSecondary : palette.textPrimary}
        />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text
            style={[
              styles.label,
              variant === 'primary' && styles.labelPrimary,
              variant === 'secondary' && styles.labelSecondary,
              variant === 'danger' && styles.labelDanger,
              variant === 'ghost' && styles.labelGhost,
              isDisabled && styles.labelDisabled,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: theme.sizes.buttonHeight,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: palette.primary,
  },
  primaryPressed: {
    backgroundColor: palette.primaryPressed,
  },
  primaryDisabled: {
    backgroundColor: palette.primaryDisabled,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  secondaryPressed: {
    backgroundColor: palette.secondaryPressed,
  },
  secondaryDisabled: {
    opacity: 0.7,
  },
  danger: {
    backgroundColor: palette.danger,
  },
  dangerPressed: {
    backgroundColor: palette.dangerPressed,
  },
  dangerDisabled: {
    opacity: 0.7,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: palette.ghostPressed,
  },
  ghostDisabled: {
    opacity: 0.55,
  },
  bordered: {
    borderWidth: 1,
    borderColor: palette.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  labelPrimary: {
    color: palette.textPrimary,
  },
  labelSecondary: {
    color: palette.textSecondary,
  },
  labelDanger: {
    color: palette.textDanger,
  },
  labelGhost: {
    color: palette.textGhost,
  },
  labelDisabled: {
    opacity: 0.85,
  },
});
