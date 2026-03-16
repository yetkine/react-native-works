import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { registerWithEmail } from './services/authService';
import CustomInput from './components/CustomInput';
import PrimaryButton from './components/PrimaryButton';
import useAuth from './hooks/useAuth';
import { useToast } from './context/ToastContext';
import { getFirebaseAuthErrorMessage } from './utils/firebaseErrorMessages';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/profile');
    }
  }, [authLoading, user]);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerWithEmail(email, password);

      showToast('Kayıt işlemi tamamlandı. Şimdi giriş yapabilirsin.', 'success');
      setPassword('');
      router.replace('/login');
    } catch (error: any) {
      showToast(getFirebaseAuthErrorMessage(error.code), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <CustomInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryButton
        title={loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        onPress={handleRegister}
        disabled={loading}
      />
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
});