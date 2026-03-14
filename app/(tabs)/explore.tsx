import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Auth Denemesi</Text>

      <Pressable style={styles.button} onPress={() => router.push('/register')}>
        <Text style={styles.buttonText}>Register Ekranına Git</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondButton]}
        onPress={() => router.push('../login')}>
        <Text style={styles.buttonText}>Login Ekranına Git</Text>
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
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
    minWidth: 220,
    alignItems: 'center',
  },
  secondButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
