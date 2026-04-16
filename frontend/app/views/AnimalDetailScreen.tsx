
export default function AnimalDetailScreen() {
  return null;
}
// import React from 'react';
// import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
// import { useAnimalDetailViewModel } from '../viewmodel/useAnimalDetailViewModel';

// // Exemplo: o id do animal pode vir de props, navigation params, etc.
// const animalId = 'QRCODE123'; // Substitua conforme necessário

// const AnimalDetailScreen = () => {
//   const { animal, manejos, loading, error } = useAnimalDetailViewModel(animalId);

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>Ficha do Animal</Text>
//         <View style={[styles.badge, animal?.status === 'Ativo' && styles.badgeAtivo]}>
//           <Text style={styles.badgeText}>{animal?.status}</Text>
//         </View>
//       </View>

//       {/* Tabs simulados */}
//       <View style={styles.tabsRow}>
//         <Pressable style={styles.tabActive}><Text style={styles.tabText}>Dados</Text></Pressable>
//         <Pressable style={styles.tab}><Text style={styles.tabText}>Histórico</Text></Pressable>
//       </View>

//       {/* Dados do animal */}
//       <View style={styles.card}>
//         <InfoRow label="QR Code" value={animal?.qrcode_token} />
//         <InfoRow label="RFID" value={animal?.rfid_tag} />
//         <InfoRow label="Sexo" value={animal?.sexo === 'M' ? '♂ Macho' : '♀ Fêmea'} />
//         <InfoRow label="Raça" value={animal?.raca} />
//         <InfoRow label="Nascimento" value={animal?.data_nascimento} />
//         <InfoRow label="Fazenda" value={animal?.fazendas?.nome_fazenda || ''} />
//       </View>

//       {/* Histórico de manejos */}
//       <Text style={styles.sectionTitle}>Histórico</Text>
//       {loading ? (
//         <ActivityIndicator style={{ marginVertical: 24 }} />
//       ) : error ? (
//         <Text style={styles.emptyText}>{error}</Text>
//       ) : manejos.length === 0 ? (
//         <Text style={styles.emptyText}>Nenhum registro de manejo ainda.</Text>
//       ) : (
//         manejos.map((m) => (
//           <View key={m.id} style={styles.timelineItem}>
//             <View style={styles.timelineIcon} />
//             <View style={styles.timelineCard}>
//               <View style={styles.timelineHeader}>
//                 <Text style={styles.timelineTitle}>{m.tipo_evento}</Text>
//                 <Text style={styles.timelineDate}>{m.data_hora}</Text>
//               </View>
//               {m.peso_kg && <Text style={styles.timelineText}>⚖️ {m.peso_kg} Kg</Text>}
//               {m.vacina && <Text style={styles.timelineText}>💉 {m.vacina}</Text>}
//               {m.observacoes && <Text style={styles.timelineObs}>{m.observacoes}</Text>}
//             </View>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const InfoRow = ({ label, value }: { label: string; value: string | null }) => (
//   <View style={styles.infoRow}>
//     <Text style={styles.infoLabel}>{label}</Text>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   title: { fontSize: 22, fontWeight: 'bold' },
//   badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#ccc' },
//   badgeAtivo: { backgroundColor: '#22c55e' },
//   badgeText: { color: '#fff', fontWeight: 'bold' },
//   tabsRow: { flexDirection: 'row', marginBottom: 16 },
//   tab: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#eee' },
//   tabActive: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#22c55e' },
//   tabText: { fontSize: 16, fontWeight: 'bold' },
//   card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 24 },
//   infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   infoLabel: { fontWeight: 'bold', color: '#333' },
//   infoValue: { color: '#555' },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
//   emptyText: { textAlign: 'center', color: '#888', marginVertical: 16 },
//   timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
//   timelineIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', marginRight: 12 },
//   timelineCard: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, elevation: 1 },
//   timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
//   timelineTitle: { fontWeight: 'bold', fontSize: 15 },
//   timelineDate: { color: '#888', fontSize: 12 },
//   timelineText: { fontSize: 14 },
//   timelineObs: { color: '#888', fontSize: 12 },
// });

// export default AnimalDetailScreen;
