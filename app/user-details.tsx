import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function UserDetailsScreen() {
  const { name, email } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Detayı</Text>

      <View style={styles.card}>
        <Text style={styles.label}>İsim:</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>E-posta:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: 'black',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontSize: 17,
    color: '#444',
  },
});
