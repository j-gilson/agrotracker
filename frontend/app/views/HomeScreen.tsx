export default function HomeScreen() {
  return null;
}



// import React, { useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// // import { useHomeViewModel } from '../../src/viewmodel/useHomeViewModel';
// // import { testarConexaoBackend } from '../../src/services/api';

// const HomeScreen = () => {
//   const { stats, loading, error } = useHomeViewModel();

//   // Testa conexão com backend ao abrir a tela
//   useEffect(() => {
//     testarConexaoBackend();
//   }, []);

// const HomeScreen = () => {
//   const { stats, loading, error } = useHomeViewModel();

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Olá! 👋</Text>
//         <Text style={styles.subtitle}>Gerencie seu rebanho com facilidade.</Text>
//       </View>

//       <TouchableOpacity style={styles.scanButton}>
//         <Text style={styles.scanButtonText}>Escanear Novo Brinco</Text>
//       </TouchableOpacity>

//       {loading ? (
//         <ActivityIndicator style={{ marginVertical: 24 }} />
//       ) : error ? (
//         <Text style={styles.quickActionsTitle}>{error}</Text>
//       ) : (
//         <View style={styles.statsRow}>
//           <StatCard label="Animais Ativos" value={stats.animais} />
//           <StatCard label="Manejos" value={stats.manejos} />
//           <StatCard label="Fazendas" value={stats.fazendas} />
//         </View>
//       )}

//       <Text style={styles.quickActionsTitle}>Ações Rápidas</Text>
//       <View style={styles.quickActionsRow}>
//         <QuickActionCard label="Inventário" />
//         <QuickActionCard label="Nova Fazenda" />
//       </View>
//     </ScrollView>
//   );
// };

// const StatCard = ({ label, value }: { label: string; value: number }) => (
//   <View style={styles.statCard}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// const QuickActionCard = ({ label }: { label: string }) => (
//   <TouchableOpacity style={styles.quickActionCard}>
//     <Text style={styles.quickActionLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   header: { marginBottom: 18 },
//   title: { fontSize: 24, fontWeight: 'bold' },
//   subtitle: { color: '#888', fontSize: 15 },
//   scanButton: { backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 18 },
//   scanButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
//   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
//   statCard: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 14, alignItems: 'center', marginHorizontal: 4 },
//   statValue: { fontSize: 22, fontWeight: 'bold', color: '#22c55e' },
//   statLabel: { color: '#888', fontSize: 13 },
//   quickActionsTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
//   quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   quickActionCard: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, alignItems: 'center', marginHorizontal: 4 },
//   quickActionLabel: { fontSize: 15, fontWeight: '500' },
// });
// }
// export default HomeScreen;
