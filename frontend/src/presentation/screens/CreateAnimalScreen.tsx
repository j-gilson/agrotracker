import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useCreateAnimal } from '../viewmodels/useCreateAnimal';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, ErrorState, Input, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const CreateAnimalScreen: React.FC = () => {
  const params = useLocalSearchParams();

  // ✅ leitura segura do parâmetro vindo da rota
  const fazendaId =
    typeof params.fazendaId === 'string'
      ? params.fazendaId
      : Array.isArray(params.fazendaId)
      ? params.fazendaId[0]
      : undefined;

  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');

  const {
    createAnimal,
    createdAnimal,
    loading,
    error,
    success,
    resetState,
  } = useCreateAnimal();

  const { showSnackbar } = useSnackbar();

  const nomeError =
    nome.length > 0 && nome.trim().length < 2
      ? 'Informe um nome válido.'
      : undefined;

  const racaError =
    raca.length > 0 && raca.trim().length < 2
      ? 'Informe a raça do animal.'
      : undefined;

  const idadeError =
    idade.length > 0 &&
    (Number.isNaN(Number(idade)) || Number(idade) < 0)
      ? 'Digite uma idade válida.'
      : undefined;

  const pesoError =
    peso.length > 0 &&
    (Number.isNaN(Number(peso)) || Number(peso) <= 0)
      ? 'Digite um peso maior que zero.'
      : undefined;

  const isFormValid =
    !!fazendaId &&
    nome.trim().length >= 2 &&
    raca.trim().length >= 2 &&
    idade.trim().length > 0 &&
    peso.trim().length > 0 &&
    !nomeError &&
    !racaError &&
    !idadeError &&
    !pesoError;

  useEffect(() => {
    if (!success) return;

    showSnackbar({
      message: createdAnimal
        ? `${createdAnimal.nome} cadastrado com sucesso.`
        : 'Animal cadastrado com sucesso.',
      variant: 'success',
    });

    resetState();

    if (createdAnimal?.id) {
      router.replace(
        AppRoutes.ANIMAL_DETAIL(createdAnimal.id)
      );
      return;
    }

    router.back();
  }, [
    success,
    createdAnimal,
    resetState,
    showSnackbar,
  ]);

  const handleCreate = async () => {
    if (!isFormValid || !fazendaId) return;

    await createAnimal({
      nome: nome.trim(),
      raca: raca.trim(),
      idade: Number(idade),
      peso: Number(peso),
      fazendaId,
    });
  };

  const handleBackToInventario = () => {
    router.replace(AppRoutes.INVENTARIO);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Novo Animal</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para o cadastro
          </Text>
        </View>

        <Card padding={20} shadow style={styles.form}>
          <Input
            label="Nome do Animal"
            placeholder="Ex: Mimosa"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            error={nomeError}
          />

          <Input
            label="Raça"
            placeholder="Ex: Nelore"
            value={raca}
            onChangeText={setRaca}
            returnKeyType="next"
            error={racaError}
          />

          <View style={styles.row}>
            <View style={[styles.flexItem, styles.marginRight]}>
              <Input
                label="Idade (anos)"
                placeholder="Ex: 3"
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                returnKeyType="next"
                error={idadeError}
              />
            </View>

            <View style={styles.flexItem}>
              <Input
                label="Peso (kg)"
                placeholder="Ex: 450"
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                error={pesoError}
              />
            </View>
          </View>

          {!fazendaId && (
            <>
              <ErrorState message="Nenhuma fazenda foi selecionada para este cadastro." />

              <Button
                fullWidth
                variant="secondary"
                title="Voltar e Selecionar Fazenda"
                onPress={handleBackToInventario}
                style={styles.backButton}
              />
            </>
          )}

          {error ? (
            <ErrorState message={error} />
          ) : null}

          <Button
            fullWidth
            title="Cadastrar Animal"
            onPress={handleCreate}
            loading={loading}
            disabled={!isFormValid}
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
  },

  row: {
    flexDirection: 'row',
  },

  flexItem: {
    flex: 1,
  },

  marginRight: {
    marginRight: theme.spacing.sm - 2,
  },

  backButton: {
    marginBottom: theme.spacing.md,
  },
});