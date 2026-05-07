import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, ErrorState, Input, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { useCreateEvent } from '../viewmodels/useCreateEvent';

export const CreateEventScreen: React.FC = () => {
  const params = useLocalSearchParams();

  const animalId =
    typeof params.animalId === 'string'
      ? params.animalId
      : Array.isArray(params.animalId)
      ? params.animalId[0]
      : '';

  const fazendaId =
    typeof params.fazendaId === 'string'
      ? params.fazendaId
      : Array.isArray(params.fazendaId)
      ? params.fazendaId[0]
      : '';

  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [dateText, setDateText] = useState(() => new Date().toISOString().slice(0, 16));

  const { createEvent, loading, error, success, createdEvent, resetState } = useCreateEvent();
  const { showSnackbar } = useSnackbar();

  const typeError = useMemo(() => {
    if (!type) return undefined;
    return type.trim().length < 3 ? 'Informe um tipo com ao menos 3 caracteres.' : undefined;
  }, [type]);

  const descriptionError = useMemo(() => {
    if (!description) return undefined;
    return description.trim().length < 3 ? 'Informe uma descrição mais completa.' : undefined;
  }, [description]);

  const parsedDate = useMemo(() => {
    const d = new Date(dateText);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [dateText]);

  const isValid =
    !!animalId &&
    !!fazendaId &&
    type.trim().length >= 3 &&
    description.trim().length >= 3 &&
    !!parsedDate &&
    !typeError &&
    !descriptionError;

  useEffect(() => {
    if (!success) return;

    showSnackbar({ message: 'Manejo registrado com sucesso.', variant: 'success' });
    resetState();

    if (createdEvent?.animalId) {
      router.back();
    } else {
      router.back();
    }
  }, [createdEvent?.animalId, resetState, showSnackbar, success]);

  const handleSubmit = async () => {
    if (loading || !isValid || !parsedDate) return;

    await createEvent({
      animalId,
      fazendaId,
      type: type.trim(),
      description: description.trim(),
      date: parsedDate,
    });
  };

  if (!animalId || !fazendaId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ErrorState message="Parâmetro obrigatório não informado: animalId ou fazendaId." />
          <Button title="Voltar" onPress={() => router.back()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Novo Manejo</Text>
          <Text style={styles.subtitle}>Registre um evento para este animal</Text>
        </View>

        <Card padding={20} shadow style={styles.form}>
          <Input
            label="Tipo"
            value={type}
            onChangeText={setType}
            placeholder="Ex: VACINA, PESAGEM"
            error={typeError}
            returnKeyType="next"
          />

          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o manejo"
            error={descriptionError}
            returnKeyType="next"
          />

          <Input
            label="Data (ISO)"
            value={dateText}
            onChangeText={setDateText}
            placeholder="YYYY-MM-DDTHH:mm"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          {error ? <ErrorState message={error} /> : null}

          <Button
            title="Salvar"
            fullWidth
            loading={loading}
            disabled={loading || !isValid}
            onPress={handleSubmit}
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
  scroll: {
    padding: theme.spacing.lg,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  form: {
    elevation: 4,
  },
});
