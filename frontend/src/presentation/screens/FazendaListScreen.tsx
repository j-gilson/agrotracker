import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useFazendas } from '../viewmodels/useFazendas';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { router } from 'expo-router';

export const FazendaListScreen: React.FC = () => {
  const { fazendas, loading, error, refresh } = useFazendas();

  const handleFazendaPress = (fazendaId: string) => {
    router.push({
      pathname: '/animal',
      params: { fazendaId },
    });
  };

  const renderItem = ({ item }: { item: Fazenda }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => item.id && handleFazendaPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.fazendaName}>{item.nome}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.fazendaLocation}>📍 {item.localizacao}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.centered}>
      <Text style={styles.message}>Nenhuma fazenda encontrada.</Text>
    </View>
  );

  if (loading && fazendas.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Carregando fazendas...</Text>
      </View>
    );
  }

  if (error && fazendas.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.message, styles.errorText]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Minhas Fazendas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/fazendas/create')}
          >
            <Text style={styles.addButtonText}>+ Novo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={fazendas}
        keyExtractor={(item) => item.id!}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={['#2E7D32']}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  fazendaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fazendaLocation: {
    fontSize: 15,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2E7D32',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});