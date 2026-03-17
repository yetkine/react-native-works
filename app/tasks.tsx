import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Task, TaskCategory } from './types/task';
import {
  addTaskToFirestore,
  deleteTaskFromFirestore,
  toggleTaskCompletedInFirestore,
  updateTaskTitleInFirestore,
  subscribeToUserTasks,
} from './services/taskService';
import CustomInput from './components/CustomInput';
import PrimaryButton from './components/PrimaryButton';
import useAuth from './hooks/useAuth';
import { useToast } from './context/ToastContext';
import DateTimePicker from '@react-native-community/datetimepicker';


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
  const [sortType, setSortType] = useState<'newest' | 'oldest' | 'dueDate'>('newest');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [categoryFilter, setCategoryFilter] = useState<
  'All' | 'Work' | 'Personal' | 'Study'
>('All');
  const handleEditTask = (
    taskId: string,
    currentTitle: string,
    currentDueDate?: string,
    currentCategory?: TaskCategory
  ) => {
    setTaskTitle(currentTitle);
    setDueDate(currentDueDate || '');
    setCategory(currentCategory || 'Work');
    setEditingTaskId(taskId);
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setTaskTitle('');
    setDueDate('');
    setCategory('Work');
    setEditingTaskId(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return;

    setFetchingTasks(true);

    const unsubscribe = subscribeToUserTasks((liveTasks) => {
      setTasks(liveTasks);
      setFetchingTasks(false);
    });

    return () => unsubscribe();
  }, [user]);

  const processedTasks = useMemo(() => {
    let result = [...tasks];

    if (filterType === 'pending') {
      result = result.filter((task) => !task.completed);
    }

    if (filterType === 'completed') {
      result = result.filter((task) => task.completed);
    }

    if (categoryFilter !== 'All') {
      result = result.filter((task) => task.category === categoryFilter);
    }

    result = result.filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    );

    if (sortType === 'oldest') {
      result = [...result].reverse();
    }

    if (sortType === 'dueDate') {
      result = [...result].sort((a, b) => {
        const aDate = a.dueDate || '9999-12-31';
        const bDate = b.dueDate || '9999-12-31';
        return aDate.localeCompare(bDate);
      });
    }

    return result;
  }, [tasks, searchText, filterType, sortType, categoryFilter]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const pendingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    return dueDate < todayString;
  };

  const isDueToday = (dueDate?: string) => {
    if (!dueDate) return false;

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    return dueDate === todayString;
  };

  const handleAddTask = async () => {
    try {
      setLoading(true);

      if (isEditing && editingTaskId) {
        await updateTaskTitleInFirestore(editingTaskId, taskTitle, dueDate, category);;
        showToast('Görev güncellendi.', 'success');
        setIsEditing(false);
        setEditingTaskId(null);
      } else {
        await await addTaskToFirestore(taskTitle, dueDate, category);
        showToast('Görev kaydedildi.', 'success');
      }

      setTaskTitle('');
      setDueDate('');
      setCategory('Work');
      
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskFromFirestore(taskId);
      
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

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDueDate(formatDate(selectedDate));
    }
  };
  return (
<View style={styles.container}>
  <Stack.Screen options={{ title: 'Görevler' }} />

  {fetchingTasks ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
      <Text style={styles.infoText}>Görevler yükleniyor...</Text>
    </View>
  ) : (
    <FlatList
      data={processedTasks}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
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

          <Text style={styles.dateHint}>Örnek: 2026-03-20</Text>

          <View style={styles.datePickerWrapper}>
            <Pressable
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerButtonText}>
                {dueDate ? `Son Tarih: ${dueDate}` : 'Son tarih seç'}
              </Text>
            </Pressable>

            {dueDate ? (
              <Pressable
                style={styles.clearDateButton}
                onPress={() => setDueDate('')}>
                <Text style={styles.clearDateButtonText}>Tarihi Temizle</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.categoryRow}>
            <Pressable
              style={[
                styles.categoryButton,
                category === 'Work' && styles.activeCategoryButton,
              ]}
              onPress={() => setCategory('Work')}>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === 'Work' && styles.activeCategoryButtonText,
                ]}>
                Work
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryButton,
                category === 'Personal' && styles.activeCategoryButton,
              ]}
              onPress={() => setCategory('Personal')}>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === 'Personal' && styles.activeCategoryButtonText,
                ]}>
                Personal
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryButton,
                category === 'Study' && styles.activeCategoryButton,
              ]}
              onPress={() => setCategory('Study')}>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === 'Study' && styles.activeCategoryButtonText,
                ]}>
                Study
              </Text>
            </Pressable>
          </View>

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
              <Pressable
                style={styles.cancelEditButton}
                onPress={handleCancelEdit}>
                <Text style={styles.cancelEditButtonText}>
                  Düzenlemeyi İptal Et
                </Text>
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

          <View style={styles.sortRow}>
            <Pressable
              style={[
                styles.sortButton,
                sortType === 'newest' && styles.activeSortButton,
              ]}
              onPress={() => setSortType('newest')}>
              <Text
                style={[
                  styles.sortButtonText,
                  sortType === 'newest' && styles.activeSortButtonText,
                ]}>
                Yeni Eklenen
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.sortButton,
                sortType === 'oldest' && styles.activeSortButton,
              ]}
              onPress={() => setSortType('oldest')}>
              <Text
                style={[
                  styles.sortButtonText,
                  sortType === 'oldest' && styles.activeSortButtonText,
                ]}>
                Eski Eklenen
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.sortButton,
                sortType === 'dueDate' && styles.activeSortButton,
              ]}
              onPress={() => setSortType('dueDate')}>
              <Text
                style={[
                  styles.sortButtonText,
                  sortType === 'dueDate' && styles.activeSortButtonText,
                ]}>
                Son Tarihe Göre
              </Text>
            </Pressable>
          </View>

          <View style={styles.categoryFilterRow}>
            <Pressable
              style={[
                styles.categoryFilterButton,
                categoryFilter === 'All' && styles.activeCategoryFilterButton,
              ]}
              onPress={() => setCategoryFilter('All')}>
              <Text
                style={[
                  styles.categoryFilterButtonText,
                  categoryFilter === 'All' && styles.activeCategoryFilterButtonText,
                ]}>
                Hepsi
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryFilterButton,
                categoryFilter === 'Work' && styles.activeCategoryFilterButton,
              ]}
              onPress={() => setCategoryFilter('Work')}>
              <Text
                style={[
                  styles.categoryFilterButtonText,
                  categoryFilter === 'Work' && styles.activeCategoryFilterButtonText,
                ]}>
                Work
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryFilterButton,
                categoryFilter === 'Personal' && styles.activeCategoryFilterButton,
              ]}
              onPress={() => setCategoryFilter('Personal')}>
              <Text
                style={[
                  styles.categoryFilterButtonText,
                  categoryFilter === 'Personal' && styles.activeCategoryFilterButtonText,
                ]}>
                Personal
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryFilterButton,
                categoryFilter === 'Study' && styles.activeCategoryFilterButton,
              ]}
              onPress={() => setCategoryFilter('Study')}>
              <Text
                style={[
                  styles.categoryFilterButtonText,
                  categoryFilter === 'Study' && styles.activeCategoryFilterButtonText,
                ]}>
                Study
              </Text>
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyTitle}>
            {tasks.length === 0
              ? 'Henüz görev eklenmedi'
              : 'Bu filtreye uygun görev bulunamadı'}
          </Text>
          <Text style={styles.emptyDescription}>
            {tasks.length === 0
              ? 'Yukarıdan ilk görevini ekleyerek başlayabilirsin.'
              : 'Arama, durum filtresi veya kategori seçimini değiştirebilirsin.'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View
          style={[
            styles.taskCard,
            isOverdue(item.dueDate) && styles.overdueCard,
            isDueToday(item.dueDate) && styles.dueTodayCard,
          ]}>
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
                <Text
                  style={[
                    styles.dueDateText,
                    isOverdue(item.dueDate) && styles.overdueText,
                    isDueToday(item.dueDate) && styles.dueTodayText,
                  ]}>
                  {isOverdue(item.dueDate)
                    ? `Gecikti: ${item.dueDate}`
                    : isDueToday(item.dueDate)
                    ? `Bugün: ${item.dueDate}`
                    : `Son tarih: ${item.dueDate}`}
                </Text>
              ) : null}

              {item.category ? (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
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
              onPress={() =>
                handleEditTask(item.id, item.title, item.dueDate, item.category)
              }>
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
    paddingBottom: 30,
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
  overdueText: {
  color: '#c62828',
  fontWeight: 'bold',
},
dueTodayText: {
  color: '#ef6c00',
  fontWeight: 'bold',
},
overdueCard: {
  borderWidth: 1,
  borderColor: '#ef9a9a',
  backgroundColor: '#fff5f5',
},
dueTodayCard: {
  borderWidth: 1,
  borderColor: '#ffcc80',
  backgroundColor: '#fff8f0',
},
sortRow: {
  flexDirection: 'row',
  gap: 8,
  marginBottom: 14,
},
sortButton: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: '#f0f0f0',
  alignItems: 'center',
},
activeSortButton: {
  backgroundColor: '#222',
},
sortButtonText: {
  color: '#333',
  fontWeight: '600',
  fontSize: 12,
},
activeSortButtonText: {
  color: 'white',
},
dateHint: {
  marginTop: -8,
  marginBottom: 12,
  fontSize: 12,
  color: '#666',
},
datePickerWrapper: {
  marginBottom: 16,
},
datePickerButton: {
  borderWidth: 1,
  borderColor: '#999',
  borderRadius: 10,
  padding: 14,
  backgroundColor: 'white',
},
datePickerButtonText: {
  fontSize: 16,
  color: 'black',
},
clearDateButton: {
  marginTop: 8,
  alignSelf: 'flex-start',
},
clearDateButtonText: {
  color: '#c62828',
  fontWeight: '600',
},
categoryRow: {
  flexDirection: 'row',
  gap: 8,
  marginBottom: 16,
},
categoryButton: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: '#f0f0f0',
  alignItems: 'center',
},
activeCategoryButton: {
  backgroundColor: 'black',
},
categoryButtonText: {
  color: '#333',
  fontWeight: '600',
  fontSize: 13,
},
activeCategoryButtonText: {
  color: 'white',
},
categoryBadge: {
  alignSelf: 'flex-start',
  marginTop: 8,
  backgroundColor: '#ececec',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 999,
},
categoryBadgeText: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#333',
},
categoryFilterRow: {
  flexDirection: 'row',
  gap: 8,
  marginBottom: 14,
  flexWrap: 'wrap',
},
categoryFilterButton: {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 10,
  backgroundColor: '#f0f0f0',
  alignItems: 'center',
},
activeCategoryFilterButton: {
  backgroundColor: '#111',
},
categoryFilterButtonText: {
  color: '#333',
  fontWeight: '600',
  fontSize: 13,
},
activeCategoryFilterButtonText: {
  color: 'white',
},
});