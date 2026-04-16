
// import React from 'react';
// import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
// import { useManejosViewModel } from '../viewmodel/useManejosViewModel';

// const ManejosScreen = () => {
//   const { manejos, loading, error } = useManejosViewModel();

//   const tipoBadge = (tipo: string) => {
//     switch (tipo) {
//       case 'Vacinação': return { backgroundColor: '#2563eb' };
//       case 'Pesagem': return { backgroundColor: '#eab308' };
//       case 'Movimentação': return { backgroundColor: '#a21caf' };
//       default: return { backgroundColor: '#ccc' };
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Manejos Realizados</Text>
//       {loading ? (
//         <ActivityIndicator style={{ marginVertical: 24 }} />
//       ) : error ? (
//         <Text style={styles.emptyText}>{error}</Text>
//       ) : manejos.length === 0 ? (
//         <Text style={styles.emptyText}>Nenhum manejo registrado.</Text>
//       ) : (
//         manejos.map((m) => (
//           <View key={m.id} style={styles.card}>
//             <View style={styles.rowBetween}>
//               <View style={[styles.badge, tipoBadge(m.tipo_evento)]}>
//                 <Text style={styles.badgeText}>{m.tipo_evento}</Text>
//               </View>
//               <Text style={styles.date}>{m.data_hora}</Text>
//             </View>
//             <Text style={styles.animal}>Animal: {m.animais?.qrcode_token ?? '—'}</Text>
//             {m.peso_kg && <Text style={styles.info}>Peso: {m.peso_kg} kg</Text>}
//             {m.vacina && <Text style={styles.info}>Vacina: {m.vacina}</Text>}
//             {m.observacoes && <Text style={styles.info}>{m.observacoes}</Text>}
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const tipoBadge = (tipo: string) => {
//   switch (tipo) {
//     case 'Vacinação': return { backgroundColor: '#2563eb' };
//     case 'Pesagem': return { backgroundColor: '#eab308' };
//     case 'Movimentação': return { backgroundColor: '#a21caf' };
//     default: return { backgroundColor: '#ccc' };
//   }
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
//   emptyText: { textAlign: 'center', color: '#888', marginVertical: 24 },
//   card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 14, marginBottom: 10 },
//   rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
//   badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
//   badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
//   date: { color: '#888', fontSize: 12 },
//   animal: { fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
//   info: { color: '#555', fontSize: 13 },
// });

// export default ManejosScreen;
export default function ManejosScreen() {
  return null;
}
