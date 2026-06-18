import React, { useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '../../core/theme';
import { Button, Card, ErrorState, Input, PageHeader, RoleGuard, useSnackbar } from '../components';
import { useInviteUser } from '../viewmodels/useInviteUser';
import { MemberRole } from '../../domain/membership/types';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

const roleLabels: Record<MemberRole, string> = {
  ADMIN: 'Administrador',
  FUNCIONARIO: 'Funcionário',
};

export const InviteUserScreen: React.FC = () => {
  const params = useLocalSearchParams<{ fazendaId?: string | string[] }>();
  const id =
    typeof params.fazendaId === 'string'
      ? params.fazendaId
      : Array.isArray(params.fazendaId)
      ? params.fazendaId[0]
      : '';

  if (!id) {
    return <ErrorState message="Parâmetro obrigatório não informado: fazendaId." />;
  }

  return (
    <RoleGuard fazendaId={id} roles={['ADMIN']}>
      <InviteUserContent fazendaId={id} />
    </RoleGuard>
  );
};

const InviteUserContent: React.FC<{ fazendaId: string }> = ({ fazendaId }) => {
  const { email, setEmail, role, setRole, loading, error, invite, inviteUser } =
    useInviteUser(fazendaId);
  const { showSnackbar } = useSnackbar();

  const emailError = useMemo(() => {
    if (!email) return undefined;
    if (!email.includes('@')) return 'Digite um e-mail valido.';
    return undefined;
  }, [email]);

  const isValid = email.trim().length > 0 && !emailError;

  const handleSubmit = async () => {
    if (loading || !isValid) return;

    const created = await inviteUser();
    if (created) {
      showSnackbar({ message: 'Convite criado com sucesso.', variant: 'success' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: SAFE_TOP }]}
    >
      <View style={styles.inner}>
        <PageHeader
          title="Convidar membro"
          subtitle="Envie o convite por e-mail (token gerado)"
        />

        <Card padding={20} shadow style={styles.form}>
          <Input
            autoCapitalize="none"
            error={emailError}
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            placeholder="funcionario@empresa.com"
            returnKeyType="done"
            value={email}
          />

          <View style={styles.roleRow}>
            <Text style={styles.roleLabel}>Acesso</Text>
            <View style={styles.roleButtons}>
              <Button
                title={roleLabels.FUNCIONARIO}
                onPress={() => setRole('FUNCIONARIO')}
                disabled={loading}
                variant={role === 'FUNCIONARIO' ? 'primary' : 'secondary'}
                style={styles.roleButton}
              />
              <Button
                title={roleLabels.ADMIN}
                onPress={() => setRole('ADMIN')}
                disabled={loading}
                variant={role === 'ADMIN' ? 'primary' : 'secondary'}
                style={styles.roleButton}
              />
            </View>
          </View>

          <Button
            disabled={loading || !isValid}
            fullWidth
            loading={loading}
            onPress={handleSubmit}
            title="Confirmar convite"
          />

          {error ? <ErrorState message={error} /> : null}

          {invite ? (
            <View style={styles.tokenBox}>
              <Text style={styles.tokenTitle}>Token do convite</Text>
              <Text style={styles.tokenValue}>{invite.token}</Text>
              <Text style={styles.tokenHelp}>
                O funcionário deve aceitar o convite autenticado usando este token.
              </Text>
            </View>
          ) : null}
        </Card>
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
  form: {
    width: '100%',
  },
  roleRow: {
    marginBottom: theme.spacing.md,
  },
  roleLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  roleButton: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 10,
  },
  tokenBox: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSubtle,
  },
  tokenTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  tokenValue: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textAccent,
  },
  tokenHelp: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
