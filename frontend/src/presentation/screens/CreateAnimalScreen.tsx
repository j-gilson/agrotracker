import React, { useEffect, useMemo, useState } from 'react';
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

const getParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '' : '';

export const CreateAnimalScreen: React.FC = () => {
  const params = useLocalSearchParams<{
    fazendaId?: string | string[];
    codigoIdentificacao?: string | string[];
  }>();
  const fazendaId = getParam(params.fazendaId);
  const codigoInicial = getParam(params.codigoIdentificacao);

  const [codigoIdentificacao, setCodigoIdentificacao] = useState(codigoInicial);
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const {
    createAnimal,
    createdAnimal,
    loading,
    error,
    success,
    resetState,
  } = useCreateAnimal();
  const { showSnackbar } = useSnackbar();

  const parsedBirthDate = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) return null;
    const date = new Date(`${dataNascimento}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [dataNascimento]);

  const codigoError =
    codigoIdentificacao.length > 0 && !codigoIdentificacao.trim()
      ? 'Informe o código de identificação.'
      : undefined;
  const racaError =
    raca.length > 0 && raca.trim().length < 2
      ? 'Informe a raça do animal.'
      : undefined;
  const pesoError =
    peso.length > 0 && (Number.isNaN(Number(peso)) || Number(peso) <= 0)
      ? 'Digite um peso maior que zero.'
      : undefined;
  const dataNascimentoError =
    dataNascimento.length > 0 &&
    (!parsedBirthDate || parsedBirthDate.getTime() > Date.now())
      ? 'Use uma data válida no formato AAAA-MM-DD.'
      : undefined;

  const isFormValid =
    !!fazendaId &&
    codigoIdentificacao.trim().length > 0 &&
    raca.trim().length >= 2 &&
    peso.trim().length > 0 &&
    !!parsedBirthDate &&
    !codigoError &&
    !racaError &&
    !pesoError &&
    !dataNascimentoError;

  useEffect(() => {
    if (!success) return;

    showSnackbar({
      message: `${
        createdAnimal?.nome || createdAnimal?.codigoIdentificacao || 'Animal'
      } cadastrado com sucesso.`,
      variant: 'success',
    });
    resetState();

    if (createdAnimal?.id) {
      router.replace(AppRoutes.ANIMAL_DETAIL(createdAnimal.id));
      return;
    }
    router.back();
  }, [createdAnimal, resetState, showSnackbar, success]);

  const handleCreate = async () => {
    if (loading || !isFormValid || !parsedBirthDate) return;

    await createAnimal({
      fazendaId,
      codigoIdentificacao: codigoIdentificacao.trim(),
      nome: nome.trim() || undefined,
      raca: raca.trim(),
      peso: Number(peso),
      dataNascimento: parsedBirthDate,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Novo Animal</Text>
          <Text style={styles.subtitle}>Preencha os dados para o cadastro</Text>
        </View>

        <Card padding={20} shadow style={styles.form}>
          <Input
            autoCapitalize="characters"
            error={codigoError}
            label="Código de Identificação"
            onChangeText={setCodigoIdentificacao}
            placeholder="Ex: BRINCO-001"
            returnKeyType="next"
            value={codigoIdentificacao}
          />

          <Input
            label="Nome (opcional)"
            placeholder="Ex: Mimosa"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
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
                label="Nascimento"
                placeholder="AAAA-MM-DD"
                value={dataNascimento}
                onChangeText={setDataNascimento}
                returnKeyType="next"
                error={dataNascimentoError}
              />
            </View>

            <View style={styles.flexItem}>
              <Input
                label="Peso (kg)"
                placeholder="Ex: 450"
                value={peso}
                onChangeText={setPeso}
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                error={pesoError}
              />
            </View>
          </View>

          {!fazendaId ? (
            <>
              <ErrorState message="Parâmetro obrigatório não informado: fazendaId." />
              <Button
                fullWidth
                variant="secondary"
                title="Voltar e Selecionar Fazenda"
                onPress={() => router.replace(AppRoutes.INVENTARIO)}
                style={styles.backButton}
              />
            </>
          ) : null}

          {error ? <ErrorState message={error} /> : null}

          <Button
            fullWidth
            title="Cadastrar Animal"
            onPress={handleCreate}
            loading={loading}
            disabled={loading || !isFormValid}
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
