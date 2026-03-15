import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { logoutUser } from './services/authService';
import useAuth from './hooks/useAuth';

export default function ProfileScreen() {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Başarılı', 'Çıkış yapıldı.');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Yükleniyor...' }} />
        <Text style={styles.title}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Profil' }} />

      <Text style={styles.title}>Hoş geldin</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 14,
    color: 'black',
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    color: '#444',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});