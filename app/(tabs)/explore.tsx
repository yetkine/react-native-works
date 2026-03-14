import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function ExploreScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Explore ekranı açıldı');

    return () => {
      console.log('Explore ekranı kapandı');
    };
  }, []);

  useEffect(() => {
    console.log('Count değişti:', count);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useEffect Denemesi</Text>
      <Text style={styles.countText}>Sayaç: {count}</Text>

      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Arttır</Text>
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
  },
  countText: {
    fontSize: 22,
    marginBottom: 20,
    color: 'black',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
