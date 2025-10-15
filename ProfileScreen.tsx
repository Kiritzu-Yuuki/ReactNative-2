import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route, navigation }: Props) {
  const { user } = route.params;
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [photo, setPhoto] = useState(user.photo_url || '');
  const [address, setAddress] = useState(user.address || '');
  const [docUri, setDocUri] = useState(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
    if (result.type === 'success') setDocUri(result.uri);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setAddress(`Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`);
  };

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', String(user.id || 1));
      if (photo) {
        const resp = await fetch(photo);
        const blob = await resp.blob();
        const filename = photo.split('/').pop();
        // @ts-ignore
        formData.append('photo', { uri: photo, name: filename, type: blob.type || 'image/jpeg' });
      }
      if (docUri) {
        const resp2 = await fetch(docUri);
        const blob2 = await resp2.blob();
        const filename2 = docUri.split('/').pop();
        // @ts-ignore
        formData.append('document', { uri: docUri, name: filename2, type: blob2.type || 'application/pdf' });
      }

      const res = await fetch('http://192.168.1.100:3000/api/profile/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        Alert.alert('OK', 'Archivo(s) subidos');
      } else Alert.alert('Error', data.message || 'Error al subir');
    } catch (err) {
      Alert.alert('Error', 'No se pudo subir');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : null}
      <Button title="Seleccionar foto" onPress={pickImage} />
      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} />
      <Button title="Obtener ubicación" onPress={getLocation} />
      <Text style={{ marginVertical:8 }}>{address}</Text>
      <Button title="Seleccionar documento (scan)" onPress={pickDocument} />
      <View style={{ height:8 }} />
      <Button title="Guardar y subir archivos" onPress={uploadFiles} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, alignItems:'center' },
  title:{ fontSize:22, marginBottom:10 },
  input:{ borderWidth:1, borderColor:'#ccc', padding:10, marginVertical:5, width:'100%', borderRadius:6 },
  photo:{ width:100, height:100, borderRadius:50, marginBottom:10 }
});
