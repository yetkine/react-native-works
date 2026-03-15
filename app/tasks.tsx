import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Task } from './types/task';
import {
  fetchUserTasks,
  addTaskToFirestore,
  deleteTaskFromFirestore,
  toggleTaskCompletedInFirestore,
} from './services/taskService';

export default function TasksScreen() {
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setFetchingTasks(true);
      const fetchedTasks = await fetchUserTasks();
      setTasks(fetchedTasks);
    } catch (error: any) {
      Alert.alert('Listeleme Hatası', error.message);
    } finally {
      setFetchingTasks(false);
    }
  };

  const handleAddTask = async () => {
    try {
      setLoading(true);
      await addTaskToFirestore(taskTitle);
      Alert.alert('Başarılı', 'Görev Firestore’a kaydedildi.');
      setTaskTitle('');
      loadTasks();
    } catch (error: any) {
      Alert.alert('Kayıt Hatası', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskFromFirestore(taskId);
      Alert.alert('Başarılı', 'Görev silindi.');
      loadTasks();
    } catch (error: any) {
      Alert.alert('Silme Hatası', error.message);
    }
  };

  const handleToggleCompleted = async (
    taskId: string,
    currentCompleted: boolean
  ) => {
    try {
      await toggleTaskCompletedInFirestore(taskId, currentCompleted);
      loadTasks();
    } catch (error: any) {
      Alert.alert('Güncelleme Hatası', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Görevler' }} />

      <Text style={styles.title}>Görevlerim</Text>

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

      {fetchingTasks ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.infoText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText,
                ]}>
                {item.title}
              </Text>

              <View style={styles.actionsRow}>
                <Pressable
                  style={[styles.smallButton, styles.completeButton]}
                  onPress={() => handleToggleCompleted(item.id, item.completed)}>
                  <Text style={styles.smallButtonText}>
                    {item.completed ? 'Geri Al' : 'Tamamla'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.smallButton, styles.deleteButton]}
                  onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.smallButtonText}>Sil</Text>
                </Pressable>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    marginTop: 30,
    alignItems: 'center',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  taskText: {
    fontSize: 17,
    color: 'black',
    marginBottom: 12,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#333',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  smallButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});