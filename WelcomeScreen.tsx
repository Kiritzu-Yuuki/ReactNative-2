import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ route, navigation }: Props) {
  const { user } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {user.name}!</Text>
      <Text style={styles.subtitle}>Email: {user.email}</Text>
      <Button title="Editar perfil" onPress={() => navigation.navigate('Profile', { user })} />
      <View style={{ height: 10 }} />
      <Button title="Cerrar sesión" onPress={() => navigation.replace('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title:{ fontSize:22, marginBottom:8 },
  subtitle:{ fontSize:16, marginBottom:20 }
});
