import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google OAuth (placeholder clientId)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'GOOGLE_CLIENT_ID_PLACEHOLDER'
  });

  useEffect(() => {
    if (response?.type === 'success') {
      // In a real app, exchange token at backend and fetch user info.
      navigation.replace('Welcome', { user: { name: 'Google User', email: 'user@google.com' } });
    }
  }, [response]);

  const handleLocalLogin = async () => {
    try {
      const resp = await fetch('http://192.168.1.100:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (data.success) navigation.replace('Welcome', { user: data.user });
      else Alert.alert('Error', data.message || 'Credenciales inválidas');
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  const mockFacebook = () => {
    // Simulated Facebook login for local testing
    navigation.replace('Welcome', { user: { name: 'Facebook User', email: 'fbuser@example.com' } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Entrar" onPress={handleLocalLogin} />
      <View style={{ height: 12 }} />
      <Button title="Continuar con Google" disabled={!request} onPress={() => promptAsync()} />
      <View style={{ height: 8 }} />
      <Button title="Continuar con Facebook (mock)" onPress={mockFacebook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  title: { fontSize:22, textAlign:'center', marginBottom:20 },
  input: { borderWidth:1, borderColor:'#ccc', padding:10, marginBottom:10, borderRadius:8 }
});
