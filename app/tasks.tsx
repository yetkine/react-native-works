import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Stack } from 'expo-router';

export default function TasksScreen() {
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert('Hata', 'Önce giriş yapmalısın.');
      return;
    }

    if (!taskTitle.trim()) {
      Alert.alert('Hata', 'Görev alanı boş bırakılamaz.');
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'tasks'), {
        title: taskTitle,
        completed: false,
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Başarılı', 'Görev Firestore’a kaydedildi.');
      setTaskTitle('');
    } catch (error: any) {
      Alert.alert('Kayıt Hatası', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Görev Ekle' }} />

      <Text style={styles.title}>Yeni Görev</Text>

      <TextInput
        style={styles.input}
        placeholder="Görev yaz..."
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <Pressable style={styles.button} onPress={handleAddTask} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Kaydediliyor...' : 'Görevi Kaydet'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
