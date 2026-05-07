import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { RoleGuard, Button, ErrorState } from '../components';
import { MembersListScreen } from './MembersListScreen';

export const TeamManagementScreen: React.FC = () => {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Equipe</Text>
            <Button
              onPress={() =>
                router.push({
                  pathname: AppRoutes.FAZENDA_TEAM_INVITE,
                  params: { fazendaId: id },
                } as unknown as Href)
              }
              title="Convidar"
              variant="secondary"
              style={styles.inviteButton}
            />
          </View>
        </View>

        <MembersListScreen fazendaId={id} />
      </SafeAreaView>
    </RoleGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: theme.spacing.sm - 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  inviteButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderColor: theme.colors.transparent,
  },
});
