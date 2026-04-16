export default function ScannerScreen() {
  return null;
}
// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { useScannerViewModel } from '/viewmodel/useScannerViewModel';

// const ScannerScreen = () => {
//   const {
//     manualCode,
//     setManualCode,
//     showForm,
//     setShowForm,
//     loading,
//     error,
//     success,
//     cadastrarAnimal,
//   } = useScannerViewModel();

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Leitor de Brinco/QR Code</Text>
//       {/* Placeholder para câmera/QR Code */}
//       <View style={styles.cameraPlaceholder}>
//         <Text style={styles.cameraText}>[Câmera/QR Code aqui]</Text>
//       </View>
//       <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
//         <Text style={styles.buttonText}>Cadastrar Manualmente</Text>
//       </TouchableOpacity>
//       {showForm && (
//         <View style={styles.form}>
//           <Text style={styles.label}>Código Manual</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Digite o código do animal"
//             value={manualCode}
//             onChangeText={setManualCode}
//             editable={!loading}
//           />
//           {/* Outros campos do formulário podem ser adicionados como placeholders */}
//           {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
//           {success && <Text style={{ color: 'green', marginBottom: 8 }}>Animal cadastrado com sucesso!</Text>}
//           <TouchableOpacity style={styles.button} onPress={cadastrarAnimal} disabled={loading || !manualCode}>
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar Animal</Text>}
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
//   cameraPlaceholder: { height: 200, backgroundColor: '#eee', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
//   cameraText: { color: '#888', fontSize: 16 },
//   button: { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   form: { marginTop: 18 },
//   label: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
//   input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
// });

// export default ScannerScreen;
