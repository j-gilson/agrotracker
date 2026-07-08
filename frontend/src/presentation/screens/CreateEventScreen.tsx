import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, ErrorState, Input, PageHeader, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { useCreateEvent } from '../viewmodels/useCreateEvent';
import { EVENT_TYPE_OPTIONS, EventType } from '../../domain/events/types';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

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

  const now = useMemo(() => new Date(), []);
  const formattedDate = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const { createEvent, loading, error, success, resetState } = useCreateEvent();
  const { showSnackbar } = useSnackbar();

  const descriptionError = useMemo(() => {
    if (!description) return undefined;
    return description.trim().length < 3 ? 'Informe uma descrição mais completa.' : undefined;
  }, [description]);

  const isValid =
    !!animalId &&
    !!fazendaId &&
    !!type &&
    description.trim().length >= 3 &&
    !descriptionError;

  useEffect(() => {
    if (!success) return;

    showSnackbar({ message: 'Manejo registrado com sucesso.', variant: 'success' });
    resetState();

    router.back();
  }, [resetState, showSnackbar, success]);

  const handleSubmit = async () => {
    if (loading || !isValid) return;

    await createEvent({
      animalId,
      fazendaId,
      type,
      description: description.trim(),
      date: now,
    });
  };

  if (!animalId || !fazendaId) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
        <View style={styles.content}>
          <ErrorState message="Não foi possível abrir esta tela. Volte e tente novamente." />
          <Button title="Voltar" onPress={() => router.back()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PageHeader
          title="Novo Manejo"
          subtitle="Registre um manejo para este animal"
        />

        <Card padding={20} shadow style={styles.form}>
          <View style={styles.typeField}>
            <Text style={styles.fieldLabel} accessibilityRole="header">Tipo</Text>
            <View style={styles.typeOptions}>
              {EVENT_TYPE_OPTIONS.map((option) => {
                const selected = type === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityLabel={`Selecionar tipo ${option.label}`}
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
            required
            returnKeyType="next"
          />

          <Input
            label="Data do manejo"
            value={formattedDate}
            editable={false}
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
  form: {},
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
