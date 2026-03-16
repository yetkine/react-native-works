import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="users/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="register" options={{ title: 'Kayıt Ol', headerShown: true }} />
            <Stack.Screen name="login" options={{ title: 'Giriş Yap', headerShown: true }} />
            <Stack.Screen name="profile" options={{ title: 'Profil', headerShown: true }} />
            <Stack.Screen name="tasks" options={{ title: 'Görevler', headerShown: true }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}