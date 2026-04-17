import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '../../core/theme';

type SnackbarVariant = 'success' | 'error' | 'info';

interface SnackbarOptions {
  message: string;
  variant?: SnackbarVariant;
  durationMs?: number;
}

interface SnackbarContextValue {
  showSnackbar: (options: SnackbarOptions) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const variantStyles: Record<SnackbarVariant, { backgroundColor: string; accentColor: string }> = {
  success: {
    backgroundColor: theme.colors.primaryDark,
    accentColor: theme.colors.successSoft,
  },
  error: {
    backgroundColor: theme.colors.danger,
    accentColor: theme.colors.dangerSoft,
  },
  info: {
    backgroundColor: theme.colors.info,
    accentColor: theme.colors.infoSoft,
  },
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<SnackbarVariant>('info');
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(120)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideSnackbar = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    Animated.timing(translateY, {
      toValue: 120,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setMessage('');
    });
  }, [translateY]);

  const showSnackbar = useCallback(
    ({ message: nextMessage, variant = 'info', durationMs = 2800 }: SnackbarOptions) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(nextMessage);
      setVariant(variant);
      setVisible(true);

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 160,
      }).start();

      timeoutRef.current = setTimeout(() => {
        hideSnackbar();
      }, durationMs);
    },
    [hideSnackbar, translateY]
  );

  const value = useMemo(
    () => ({
      showSnackbar,
      hideSnackbar,
    }),
    [hideSnackbar, showSnackbar]
  );

  const currentVariantStyle = variantStyles[variant];

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {visible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.portal, { transform: [{ translateY }] }]}
        >
          <Pressable
            accessibilityRole="alert"
            onPress={hideSnackbar}
            style={[
              styles.snackbar,
              { backgroundColor: currentVariantStyle.backgroundColor },
            ]}
          >
            <View
              style={[
                styles.accent,
                { backgroundColor: currentVariantStyle.accentColor },
              ]}
            />
            <Text style={styles.message}>{message}</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar deve ser usado dentro de SnackbarProvider');
  }

  return context;
};

const styles = StyleSheet.create({
  portal: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
  },
  snackbar: {
    minHeight: 56,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  accent: {
    width: 6,
    alignSelf: 'stretch',
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.md,
  },
  message: {
    flex: 1,
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
