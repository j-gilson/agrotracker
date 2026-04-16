import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
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
import { useAnimals } from '../viewmodels/useAnimals';
import { Animal } from '../../domain/entities/Animal';

export const AnimalListScreen: React.FC = () => {
  const { fazendaId } = useLocalSearchParams();
  const { animals, loading, error, refresh } = useAnimals(fazendaId as string);

  // 🔥 Atualiza sempre que voltar pra tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.animalName}>{item.nome}</Text>
        <Text style={styles.animalRaca}>{item.raca}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.animalInfo}>Idade: {item.idade} anos</Text>
        <Text style={styles.animalInfo}>Peso: {item.peso} kg</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centered}>
      <Text style={styles.message}>Nenhum animal encontrado.</Text>
    </View>
  );

  if (loading && animals.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Carregando rebanho...</Text>
      </View>
    );
  }

  if (error && animals.length === 0) {
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
          <Text style={styles.title}>Meu Rebanho</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push({
              pathname: '/animal/create',
              params: { fazendaId }
            })}
          >
            <Text style={styles.addButtonText}>+ Novo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={animals}
        keyExtractor={(item) => item.id ?? Math.random().toString()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  animalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  animalRaca: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  animalInfo: {
    fontSize: 15,
    color: '#444',
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
