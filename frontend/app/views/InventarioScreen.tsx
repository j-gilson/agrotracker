
// import React from 'react';
// import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { useInventarioViewModel } from '../viewmodel/useInventarioViewModel';

// const InventarioScreen = () => {
//   const {
//     search,
//     setSearch,
//     filterSexo,
//     setFilterSexo,
//     filterStatus,
//     setFilterStatus,
//     animais,
//     loading,
//     error,
//   } = useInventarioViewModel();

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Inventário</Text>
//       {/* Busca */}
//       <TextInput
//         style={styles.input}
//         placeholder="Buscar por RFID, QR Code ou Raça..."
//         value={search}
//         onChangeText={setSearch}
//       />
//       {/* Filtros */}
//       <View style={styles.filtersRow}>
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Sexo"
//           value={filterSexo}
//           onChangeText={setFilterSexo}
//         />
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Status"
//           value={filterStatus}
//           onChangeText={setFilterStatus}
//         />
//       </View>
//       {/* Lista de animais */}
//       {loading ? (
//         <ActivityIndicator style={{ marginVertical: 24 }} />
//       ) : error ? (
//         <Text style={styles.emptyText}>{error}</Text>
//       ) : animais.length === 0 ? (
//         <Text style={styles.emptyText}>Nenhum animal encontrado. Escaneie um brinco para começar!</Text>
//       ) : (
//         animais.map((animal) => (
//           <TouchableOpacity key={animal.id} style={styles.card}>
//             <View style={styles.cardContent}>
//               <View style={{ flex: 1 }}>
//                 <View style={styles.rowGap}>
//                   <Text style={styles.animalCode}>{animal.qrcode_token}</Text>
//                   <View style={[styles.badge, statusColor(animal.status)]}>
//                     <Text style={styles.badgeText}>{animal.status}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.rowGap}>
//                   <Text style={styles.animalInfo}>{animal.sexo === 'M' ? '♂ Macho' : '♀ Fêmea'}</Text>
//                   <Text style={styles.animalInfo}>• {animal.raca}</Text>
//                 </View>
//                 <Text style={styles.fazendaInfo}>📍 {animal.fazendas?.nome_fazenda || ''}</Text>
//               </View>
//               <Text style={styles.arrow}>›</Text>
//             </View>
//           </TouchableOpacity>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const statusColor = (status: string) => {
//   switch (status) {
//     case 'Ativo': return { backgroundColor: '#22c55e' };
//     case 'Vendido': return { backgroundColor: '#eab308' };
//     case 'Abate': return { backgroundColor: '#ef4444' };
//     default: return { backgroundColor: '#ccc' };
//   }
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
//   input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
//   filtersRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
//   filterInput: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 10, fontSize: 15, borderWidth: 1, borderColor: '#eee' },
//   emptyText: { textAlign: 'center', color: '#888', marginVertical: 24 },
//   card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 14, marginBottom: 10 },
//   cardContent: { flexDirection: 'row', alignItems: 'center' },
//   rowGap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   animalCode: { fontWeight: 'bold', fontSize: 15 },
//   badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
//   badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
//   animalInfo: { color: '#555', fontSize: 13, marginRight: 8 },
//   fazendaInfo: { color: '#888', fontSize: 12, marginTop: 2 },
//   arrow: { color: '#888', fontSize: 22, marginLeft: 8 },
// });

// export default InventarioScreen;
export default function InventarioScreen() {
  return null;
}
