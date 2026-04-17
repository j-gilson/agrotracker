import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useCreateFazenda } from '../viewmodels/useCreateFazenda';
import { router } from 'expo-router';
import { Button, Card, ErrorState, Input, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const CreateFazendaScreen: React.FC = () => {
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const { createFazenda, createdFazenda, loading, error, success, resetState } = useCreateFazenda();
  const { showSnackbar } = useSnackbar();
  const nomeError =
    nome.length > 0 && nome.trim().length < 3
      ? 'Use ao menos 3 caracteres.'
      : undefined;
  const localizacaoError =
    localizacao.length > 0 && localizacao.trim().length < 3
      ? 'Informe uma localizacao mais completa.'
      : undefined;
  const isFormValid =
    nome.trim().length >= 3 &&
    localizacao.trim().length >= 3 &&
    !nomeError &&
    !localizacaoError;

  useEffect(() => {
    if (!success) return;

    showSnackbar({
      message: createdFazenda
        ? `Fazenda ${createdFazenda.nome} cadastrada com sucesso.`
        : 'Fazenda cadastrada com sucesso.',
      variant: 'success',
    });
    resetState();
    router.replace({ pathname: AppRoutes.FAZENDAS });
  }, [createdFazenda, resetState, showSnackbar, success]);
  
  const handleCreate = async () => {
    if (!isFormValid) {
      return;
    }

    await createFazenda({
      nome,
      localizacao,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Nova Fazenda</Text>
          <Text style={styles.subtitle}>Registre uma nova propriedade rural</Text>
        </View>

        <Card padding={20} shadow style={styles.form}>
          <Input
            error={nomeError}
            label="Nome da Fazenda"
            onChangeText={setNome}
            placeholder="Ex: Fazenda Santa Fé"
            returnKeyType="next"
            value={nome}
          />

          <Input
            error={localizacaoError}
            label="Localização"
            onChangeText={setLocalizacao}
            onSubmitEditing={handleCreate}
            placeholder="Ex: Mato Grosso, BR"
            returnKeyType="done"
            value={localizacao}
          />

          {error ? <ErrorState message={error} /> : null}

          <Button
            disabled={!isFormValid}
            fullWidth
            loading={loading}
            onPress={handleCreate}
            title="Salvar Fazenda"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl + theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs - 3,
  },
  form: {
    elevation: 4,
    shadowColor: theme.shadows.md.shadowColor,
    shadowOffset: theme.shadows.md.shadowOffset,
    shadowOpacity: theme.shadows.md.shadowOpacity,
    shadowRadius: theme.shadows.md.shadowRadius,
  },
});
