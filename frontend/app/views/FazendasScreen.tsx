
export default function FazendasScreen() {
  return null;
}
// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
//ainda não vamos usar agora no momento 
//import { useFazendasViewModel } from '../../src/presentation/viewmodels/useFazendasViewModel';
// const FazendasScreen = () => {
//   const { fazendas, loading, error } = useFazendasViewModel();

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>Fazendas</Text>
//         <TouchableOpacity style={styles.addButton}>
//           <Text style={styles.addButtonText}>+ Nova</Text>
//         </TouchableOpacity>
//       </View>
//       {loading ? (
//         <ActivityIndicator style={{ marginVertical: 24 }} />
//       ) : error ? (
//         <Text style={styles.emptyText}>{error}</Text>
//       ) : fazendas.length === 0 ? (
//         <Text style={styles.emptyText}>Nenhuma fazenda cadastrada.</Text>
//       ) : (
//         fazendas.map((f) => (
//           <View key={f.id} style={styles.card}>
//             <Text style={styles.fazendaNome}>{f.nome_fazenda}</Text>
//             {f.endereco && <Text style={styles.fazendaInfo}>📍 {f.endereco}</Text>}
//             {f.telefone && <Text style={styles.fazendaInfo}>📞 {f.telefone}</Text>}
//             {f.nome_responsavel && <Text style={styles.fazendaInfo}>👤 {f.nome_responsavel}</Text>}
//             {f.email_responsavel && <Text style={styles.fazendaInfo}>✉️ {f.email_responsavel}</Text>}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   title: { fontSize: 22, fontWeight: 'bold' },
//   addButton: { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18 },
//   addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   emptyText: { textAlign: 'center', color: '#888', marginVertical: 24 },
//   card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 14 },
//   fazendaNome: { fontWeight: 'bold', fontSize: 17, marginBottom: 4 },
//   fazendaInfo: { color: '#555', fontSize: 14 },
// });

// export default FazendasScreen;
