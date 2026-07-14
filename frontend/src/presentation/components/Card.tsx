import React from 'react';
import {
  Pressable,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../../core/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  shadow?: boolean;
  padding?: number;
  marginBottom?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean; busy?: boolean };
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  shadow = true,
  padding = 16,
  marginBottom = 0,
  style,
  accessibilityLabel,
  accessibilityState,
}) => {
  const content = (
    <View
      style={[
        styles.base,
        shadow ? styles.shadow : styles.flat,
        { padding, marginBottom },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  shadow: Platform.select({
    web: {
      boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
    },
    default: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
  }),

  flat: Platform.select({
    web: {
      boxShadow: 'none',
    },
    default: {
      elevation: 0,
    },
  }),

  pressable: {
    borderRadius: theme.radius.xl,
  },

  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
});
