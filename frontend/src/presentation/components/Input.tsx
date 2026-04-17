import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { theme } from '../../core/theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  error?: string;
  helperText?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  helperText,
  autoCapitalize = 'sentences',
  returnKeyType,
  onSubmitEditing,
  editable = true,
}) => {
  const helperMessage = error ?? helperText;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label ?? placeholder}
        autoCapitalize={autoCapitalize}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null,
          error ? styles.inputError : null,
          !editable ? styles.inputDisabled : null,
        ]}
        value={value}
      />
      {helperMessage ? (
        <Text style={[styles.helperText, error ? styles.errorText : null]}>
          {helperMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md + 2,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    minHeight: theme.sizes.inputHeight,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSubtle,
    paddingHorizontal: theme.spacing.lg - 2,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.dangerStrong,
    backgroundColor: theme.colors.dangerSurface,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  helperText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.danger,
  },
});
