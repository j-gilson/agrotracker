
// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { useNovaFazendaViewModel } from '../../src/viewmodel/useNovaFazendaViewModel';

// // Exemplo: o id do proprietário pode vir de contexto, props, etc.
// const proprietario_id = 'USER_ID'; // Substitua conforme necessário

// const NovaFazendaScreen = () => {
//   const {
//     nome,
//     setNome,
//     endereco,
//     setEndereco,
//     telefone,
//     setTelefone,
//     nomeResponsavel,
//     setNomeResponsavel,
//     emailResponsavel,
//     setEmailResponsavel,
//     loading,
//     error,
//     success,
//     cadastrar,
//   } = useNovaFazendaViewModel();

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Nova Fazenda</Text>
//       <View style={styles.form}>
//         <Text style={styles.label}>Nome da Fazenda *</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Ex: Fazenda São José"
//           value={nome}
//           onChangeText={setNome}
//         />
//         <Text style={styles.label}>Endereço</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Cidade, Estado"
//           value={endereco}
//           onChangeText={setEndereco}
//         />
//         <Text style={styles.label}>Telefone</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="(00) 00000-0000"
//           value={telefone}
//           onChangeText={setTelefone}
//         />
//         <Text style={styles.label}>Nome do Responsável</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Ex: João Silva"
//           value={nomeResponsavel}
//           onChangeText={setNomeResponsavel}
//         />
//         <Text style={styles.label}>Email do Responsável</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="responsavel@email.com"
//           value={emailResponsavel}
//           onChangeText={setEmailResponsavel}
//           keyboardType="email-address"
//         />
//         {error && <Text style={{ color: '#ef4444', marginTop: 8, textAlign: 'center' }}>{error}</Text>}
//         {success && <Text style={{ color: '#22c55e', marginTop: 8, textAlign: 'center' }}>{success}</Text>}
//         <TouchableOpacity style={styles.button} disabled={loading} onPress={() => cadastrar(proprietario_id)}>
//           {loading && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
//           <Text style={styles.buttonText}>Cadastrar Fazenda</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
//   form: { marginTop: 8 },
//   label: { fontWeight: 'bold', color: '#333', marginBottom: 4, marginTop: 10 },
//   input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
//   button: { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 18, flexDirection: 'row', justifyContent: 'center' },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });

// export default NovaFazendaScreen;
export default function NovaFazendaScreen() {
  return null;
}
