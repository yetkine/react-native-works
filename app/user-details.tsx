import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

type UserDetail = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
};

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserDetail();
    }
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      const data = await response.json();

      setUser(data);
    } catch (err) {
      setError('Kullanıcı detayı alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Detay yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Kullanıcı bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Detayı</Text>

      <View style={styles.card}>
        <Text style={styles.label}>İsim:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>E-posta:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>{user.phone}</Text>

        <Text style={styles.label}>Website:</Text>
        <Text style={styles.value}>{user.website}</Text>
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
  centered: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: 'black',
  },
  infoText: {
    marginTop: 15,
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
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
