import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { EmptyState } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const NotFoundScreen: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <EmptyState
          buttonText="Voltar para o Início"
          icon={<View style={styles.icon} />}
          onPress={() => router.replace({ pathname: AppRoutes.HOME })}
          subtitle="Desculpe, a página que você está procurando não existe ou foi movida."
          title="Tela não encontrada."
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primaryLight,
  },
});
