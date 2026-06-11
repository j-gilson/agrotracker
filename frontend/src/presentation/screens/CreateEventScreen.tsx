import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, ErrorState, Input, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { useCreateEvent } from '../viewmodels/useCreateEvent';
import { EVENT_TYPE_OPTIONS, EventType } from '../../domain/events/types';

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

  const [type, setType] = useState<EventType | null>(null);
  const [description, setDescription] = useState('');
  const [dateText, setDateText] = useState(() => new Date().toISOString().slice(0, 16));

  const { createEvent, loading, error, success, resetState } = useCreateEvent();
  const { showSnackbar } = useSnackbar();

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
    !!type &&
    description.trim().length >= 3 &&
    !!parsedDate &&
    !descriptionError;

  useEffect(() => {
    if (!success) return;

    showSnackbar({ message: 'Manejo registrado com sucesso.', variant: 'success' });
    resetState();

    router.back();
  }, [resetState, showSnackbar, success]);

  const handleSubmit = async () => {
    if (loading || !isValid || !parsedDate) return;

    await createEvent({
      animalId,
      fazendaId,
      type,
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
          <View style={styles.typeField}>
            <Text style={styles.fieldLabel}>Tipo</Text>
            <View style={styles.typeOptions}>
              {EVENT_TYPE_OPTIONS.map((option) => {
                const selected = type === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setType(option.value)}
                    style={[styles.typeOption, selected && styles.typeOptionSelected]}
                  >
                    <Text style={[styles.typeOptionText, selected && styles.typeOptionTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

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
  typeField: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeOption: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  typeOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  typeOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
  },
  typeOptionTextSelected: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
