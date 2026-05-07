import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router, type Href } from 'expo-router';
import { useLoginViewModel } from '../../viewmodels/useAuth';
import { Button, Card, Input, useSnackbar } from '../../components';
import { theme } from '../../../core/theme';
import { AppRoutes } from '../../../core/routes/AppRoutes';

export const LoginScreen: React.FC = () => {
  const { email, setEmail, password, setPassword, loading, error, login } =
    useLoginViewModel();
  const { showSnackbar } = useSnackbar();

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Digite um e-mail valido.' : undefined;
  const passwordError =
    password.length > 0 && password.length < 8
      ? 'A senha deve ter ao menos 8 caracteres.'
      : undefined;
  const isFormValid =
    email.trim().length > 0 &&
    password.trim().length >= 8 &&
    !emailError &&
    !passwordError;

  const handleLogin = async () => {
    if (loading) return;

    const success = await login();
    if (success) {
      showSnackbar({
        message: 'Bem-vindo de volta.',
        variant: 'success',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>AgroTracker</Text>
          <Text style={styles.tagline}>Sua fazenda na palma da mão</Text>
        </View>

        <Card padding={20} shadow style={styles.form}>
          <Input
            autoCapitalize="none"
            error={emailError}
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            placeholder="seu@email.com"
            returnKeyType="next"
            value={email}
          />

          <Input
            error={error ?? passwordError}
            label="Senha"
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            placeholder="Sua senha"
            returnKeyType="done"
            secureTextEntry
            value={password}
          />

          <Button
            disabled={loading || !isFormValid}
            fullWidth
            loading={loading}
            onPress={handleLogin}
            title="Entrar"
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <Pressable
            onPress={() => router.push(AppRoutes.REGISTER as Href)}
            style={styles.footerAction}
          >
            <Text style={styles.signUpText}>Cadastre-se</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inner: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl + theme.spacing.md,
  },
  logoText: {
    fontSize: theme.typography.fontSize.hero,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  tagline: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  form: {
    width: '100%',
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xxl,
  },
  footerText: {
    color: theme.colors.textSecondary,
  },
  footerAction: {
    marginLeft: theme.spacing.xs,
  },
  signUpText: {
    color: theme.colors.textAccent,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
