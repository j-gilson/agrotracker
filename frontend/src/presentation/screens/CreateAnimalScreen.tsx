import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useCreateAnimal } from '../viewmodels/useCreateAnimal';
import { useLocalSearchParams } from 'expo-router';

export const CreateAnimalScreen: React.FC = () => {
  const params = useLocalSearchParams();

  // ✅ NORMALIZAÇÃO SEGURA
  const fazendaId =
  typeof params.fazendaId === 'string'
    ? params.fazendaId
    : params.fazendaId?.[0];

 

  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');

  const { createAnimal, loading, error, success, resetState } =
    useCreateAnimal();

  const handleCreate = async () => {
    if (!nome || !raca || !idade || !peso) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!fazendaId) {
      Alert.alert('Erro', 'Fazenda não identificada.');
      console.log('ERRO CRÍTICO: fazendaId não veio no parametro');
      return;
      
    }

    const idadeNumber = Number(idade);
    const pesoNumber = Number(peso);

    if (isNaN(idadeNumber) || isNaN(pesoNumber)) {
      Alert.alert('Erro', 'Idade e peso devem ser números válidos.');
      return;
    }

    await createAnimal({
      nome,
      raca,
      idade: idadeNumber,
      peso: pesoNumber,
      fazendaId,
    });
    console.log('CRIANDO ANIMAL COM:', {
      nome,
      raca,
      idade,
      peso,
      fazendaId
   });
  };

  const handleReset = () => {
    setNome('');
    setRaca('');
    setIdade('');
    setPeso('');
    resetState();
  };

  if (success) {
    return (
      <View style={styles.centered}>
        <Text style={styles.successText}>Animal cadastrado com sucesso!</Text>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Cadastrar Outro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Novo Animal</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para o cadastro
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Animal</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mimosa"
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Nelore"
              value={raca}
              onChangeText={setRaca}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flexItem, styles.marginRight]}>
              <Text style={styles.label}>Idade (anos)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 3"
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, styles.flexItem]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 450.5"
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[
              styles.button,
              loading ? styles.buttonDisabled : null,
            ]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Animal</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  flexItem: {
    flex: 1,
  },
  marginRight: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 30,
  },
});