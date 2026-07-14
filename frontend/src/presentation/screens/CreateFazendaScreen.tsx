import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { useCreateFazenda } from '../viewmodels/useCreateFazenda';
import { router } from 'expo-router';
import { Button, Card, ErrorState, Input, PageHeader, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

export const CreateFazendaScreen: React.FC = () => {
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const { createFazenda, createdFazenda, loading, error, success, resetState } = useCreateFazenda();
  const { refreshFarms, setActiveFarm } = useActiveFarm();
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
    if (!success || !createdFazenda?.id) return;

    const { id, nome } = createdFazenda;
    const afterCreate = async () => {
      try {
        await refreshFarms();
        await setActiveFarm(id);
      } catch {
        // Fazenda foi criada no backend, mas sync local falhou
      } finally {
        showSnackbar({
          message: `Fazenda ${nome} cadastrada com sucesso.`,
          variant: 'success',
        });
        resetState();
        router.replace({ pathname: AppRoutes.FAZENDAS });
      }
    };
    afterCreate();
  }, [createdFazenda, refreshFarms, resetState, setActiveFarm, showSnackbar, success]);
  
  const handleCreate = async () => {
    if (loading || !isFormValid) {
      return;
    }

    await createFazenda({
      nome,
      localizacao,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Nova Fazenda"
          subtitle="Registre uma nova propriedade rural"
        />

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
            disabled={loading || !isFormValid}
            fullWidth
            loading={loading}
            onPress={handleCreate}
            title="Salvar"
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
  form: {
    elevation: 4,
    shadowColor: theme.shadows.md.shadowColor,
    shadowOffset: theme.shadows.md.shadowOffset,
    shadowOpacity: theme.shadows.md.shadowOpacity,
    shadowRadius: theme.shadows.md.shadowRadius,
  },
});
