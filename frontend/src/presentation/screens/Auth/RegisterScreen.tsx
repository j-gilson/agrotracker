import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useRegisterViewModel } from '../../viewmodels/useAuth';
import { Button, Card, ErrorState, Input, useSnackbar } from '../../components';
import { theme } from '../../../core/theme';
import { AppRoutes } from '../../../core/routes/AppRoutes';

export const RegisterScreen: React.FC = () => {
  const {
    nome,
    setNome,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    register,
  } = useRegisterViewModel();
  const { showSnackbar } = useSnackbar();

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Digite um e-mail válido.' : undefined;

  const passwordError =
    password.length > 0 && password.length < 8
      ? 'A senha deve ter ao menos 8 caracteres.'
      : undefined;

  const confirmError =
    confirmPassword.length > 0 && confirmPassword !== password
      ? 'As senhas não conferem.'
      : undefined;

  const isFormValid =
    nome.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    confirmPassword.length >= 8 &&
    password === confirmPassword &&
    !emailError &&
    !passwordError &&
    !confirmError;

  const handleRegister = async () => {
    if (loading) return;

    const success = await register();
    if (success) {
      showSnackbar({
        message: 'Conta criada com sucesso. Faça login para continuar.',
        variant: 'success',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para acessar sua fazenda</Text>
        </View>

        <Card padding={20} shadow style={styles.form}>
          <Input
            autoCapitalize="words"
            label="Nome"
            onChangeText={setNome}
            placeholder="Seu nome"
            required
            returnKeyType="next"
            value={nome}
          />

          <Input
            autoCapitalize="none"
            error={emailError}
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            placeholder="seu@email.com"
            required
            returnKeyType="next"
            value={email}
          />

          <Input
            accessibilityHint="Mínimo de 8 caracteres"
            error={passwordError}
            label="Senha"
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            required
            returnKeyType="next"
            secureTextEntry
            value={password}
          />

          <Input
            accessibilityHint="Digite a mesma senha novamente"
            error={confirmError}
            label="Confirmar senha"
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleRegister}
            placeholder="Repita a senha"
            required
            returnKeyType="done"
            secureTextEntry
            value={confirmPassword}
          />

          {error ? <ErrorState message={error} /> : null}

          <Button
            disabled={loading || !isFormValid}
            fullWidth
            loading={loading}
            onPress={handleRegister}
            title="Cadastrar"
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <Pressable
            accessibilityLabel="Entrar"
            accessibilityRole="link"
            onPress={() => router.replace({ pathname: AppRoutes.AUTH })}
            style={styles.footerAction}
          >
            <Text style={styles.signInText}>Entrar</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl + theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  subtitle: {
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
  signInText: {
    color: theme.colors.textAccent,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
