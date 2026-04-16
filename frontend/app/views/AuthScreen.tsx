
// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
// import { useAuthViewModel } from '../../src/viewmodel/useAuthViewModel';

// const AuthScreen = () => {
//   const {
//     isLogin,
//     email,
//     setEmail,
//     password,
//     setPassword,
//     nome,
//     setNome,
//     loading,
//     error,
//     success,
//     handleAuth,
//     toggleMode,
//   } = useAuthViewModel();

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <View style={styles.logoCircle}>
//             <Text style={styles.logo}>🐄</Text>
//           </View>
//           <Text style={styles.title}>Rebanho Digital</Text>
//           <Text style={styles.subtitle}>{isLogin ? 'Acesse sua conta' : 'Crie sua conta'}</Text>
//         </View>
//         <View style={styles.form}>
//           {!isLogin && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Nome</Text>
//               <TextInput
//                 style={styles.input}
//                 value={nome}
//                 onChangeText={setNome}
//                 placeholder="Seu nome completo"
//                 autoCapitalize="words"
//               />
//             </View>
//           )}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>E-mail</Text>
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="seu@email.com"
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Senha</Text>
//             <TextInput
//               style={styles.input}
//               value={password}
//               onChangeText={setPassword}
//               placeholder="••••••••"
//               secureTextEntry
//             />
//           </View>
//           {error && <Text style={styles.error}>{error}</Text>}
//           {success && <Text style={styles.success}>{success}</Text>}
//           <TouchableOpacity style={styles.button} disabled={loading} onPress={handleAuth}>
//             {loading && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
//             <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Criar Conta'}</Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
//           <Text style={styles.switchText}>
//             {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: 16 },
//   card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 12, padding: 24, elevation: 2 },
//   header: { alignItems: 'center', marginBottom: 24 },
//   logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
//   logo: { fontSize: 32 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
//   subtitle: { color: '#888', fontSize: 14 },
//   form: { marginTop: 8 },
//   inputGroup: { marginBottom: 14 },
//   label: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
//   input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
//   button: { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center' },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   switchButton: { marginTop: 18, alignItems: 'center' },
//   switchText: { color: '#22c55e', textDecorationLine: 'underline', fontSize: 14 },
// });

// export default AuthScreen;
export default function AuthScreen() {
  return null;
}
