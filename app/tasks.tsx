import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Task } from './types/task';
import {
  fetchUserTasks,
  addTaskToFirestore,
  deleteTaskFromFirestore,
  toggleTaskCompletedInFirestore,
  updateTaskTitleInFirestore,
} from './services/taskService';
import CustomInput from './components/CustomInput';
import PrimaryButton from './components/PrimaryButton';
import useAuth from './hooks/useAuth';
import { useToast } from './context/ToastContext';

export default function TasksScreen() {
  const [taskTitle, setTaskTitle] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const { user, authLoading } = useAuth();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToast();
  const [dueDate, setDueDate] = useState('');
  const handleEditTask = (
    taskId: string,
    currentTitle: string,
    currentDueDate?: string
  ) => {
    setTaskTitle(currentTitle);
    setDueDate(currentDueDate || '');
    setEditingTaskId(taskId);
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setTaskTitle('');
    setDueDate('');
    setEditingTaskId(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filterType === 'pending') {
      result = result.filter((task) => !task.completed);
    }

    if (filterType === 'completed') {
      result = result.filter((task) => task.completed);
    }

    return result.filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [tasks, searchText, filterType]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const pendingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

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

      if (isEditing && editingTaskId) {
        await updateTaskTitleInFirestore(editingTaskId, taskTitle, dueDate);
        showToast('Görev güncellendi.', 'success');
        setIsEditing(false);
        setEditingTaskId(null);
      } else {
        await addTaskToFirestore(taskTitle, dueDate);
        showToast('Görev kaydedildi.', 'success');
      }

      setTaskTitle('');
      setDueDate('');
      loadTasks();

      setTaskTitle('');
      loadTasks();
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskFromFirestore(taskId);
      loadTasks();
    } catch (error: any) {
      showToast('Görev silindi.', 'success');
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

  if (authLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Oturum kontrol ediliyor...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Görevler' }} />

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Görevlerim</Text>
        <Text style={styles.subtitle}>{user.email}</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Toplam</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Bekleyen</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Tamamlanan</Text>
        </View>
      </View>

      <CustomInput
        placeholder="Yeni görev ekle..."
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <CustomInput
        placeholder="Son tarih (örn: 2026-03-20)"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <PrimaryButton
        title={
          loading
            ? 'Kaydediliyor...'
            : isEditing
            ? 'Görevi Güncelle'
            : 'Görevi Kaydet'
        }
        onPress={handleAddTask}
        disabled={loading}
      />

      {isEditing && (
        <View style={styles.cancelEditWrapper}>
          <Pressable style={styles.cancelEditButton} onPress={handleCancelEdit}>
            <Text style={styles.cancelEditButtonText}>Düzenlemeyi İptal Et</Text>
          </Pressable>
        </View>
      )}

      <CustomInput
        placeholder="Görevlerde ara..."
        value={searchText}
        onChangeText={setSearchText}
      />


      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterButton,
            filterType === 'all' && styles.activeFilterButton,
          ]}
          onPress={() => setFilterType('all')}>
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'all' && styles.activeFilterButtonText,
            ]}>
            Hepsi
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filterType === 'pending' && styles.activeFilterButton,
          ]}
          onPress={() => setFilterType('pending')}>
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'pending' && styles.activeFilterButtonText,
            ]}>
            Açık
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filterType === 'completed' && styles.activeFilterButton,
          ]}
          onPress={() => setFilterType('completed')}>
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'completed' && styles.activeFilterButtonText,
            ]}>
            Tamamlanan
          </Text>
        </Pressable>
      </View>

      {fetchingTasks ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.infoText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyDescription}>
                {tasks.length === 0
                  ? 'Yukarıdan ilk görevini ekleyerek başlayabilirsin.'
                  : 'Arama kelimesini veya filtre seçimini değiştirebilirsin.'}
              </Text>
              <Text style={styles.emptyDescription}>
                {tasks.length === 0
                  ? 'Yukarıdan ilk görevini ekleyerek başlayabilirsin.'
                  : 'Farklı bir kelime ile tekrar arama yapabilirsin.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={styles.taskTopRow}>
                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.completedTaskText,
                    ]}>
                    {item.title}
                  </Text>

                  {item.dueDate ? (
                    <Text style={styles.dueDateText}>Son tarih: {item.dueDate}</Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.completed
                      ? styles.completedBadge
                      : styles.pendingBadge,
                  ]}>
                  <Text style={styles.statusBadgeText}>
                    {item.completed ? 'Bitti' : 'Açık'}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  style={[styles.smallButton, styles.editButton]}
                  onPress={() => handleEditTask(item.id, item.title, item.dueDate)}>
                  <Text style={styles.smallButtonText}>Düzenle</Text>
                </Pressable>

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
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
  },
  headerBlock: {
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
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
  emptyWrapper: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  taskText: {
    flex: 1,
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pendingBadge: {
    backgroundColor: '#e8e8e8',
  },
  completedBadge: {
    backgroundColor: '#d7f0d8',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: 'black',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 13,
  },
  activeFilterButtonText: {
    color: 'white',
  },
  editButton: {
    backgroundColor: '#4a67ff',
  },
  cancelEditWrapper: {
    marginTop: 10,
    marginBottom: 5,
  },
  cancelEditButton: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  taskContent: {
  flex: 1,
},
  dueDateText: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
  },
});