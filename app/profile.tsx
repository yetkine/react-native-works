import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { logoutUser } from './services/authService';
import useAuth from './hooks/useAuth';
import { fetchUserTasks } from './services/taskService';
import { Task } from './types/task';
import PrimaryButton from './components/PrimaryButton';

export default function ProfileScreen() {
  const { user, authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

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

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const fetchedTasks = await fetchUserTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.log('Profile task fetch error:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const pendingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  const workCount = useMemo(
    () => tasks.filter((task) => task.category === 'Work').length,
    [tasks]
  );

  const personalCount = useMemo(
    () => tasks.filter((task) => task.category === 'Personal').length,
    [tasks]
  );

  const studyCount = useMemo(
    () => tasks.filter((task) => task.category === 'Study').length,
    [tasks]
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/login');
    } catch (error: any) {
      console.log(error);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.centered}>
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
      <Stack.Screen options={{ title: 'Profil' }} />

      <View style={styles.headerBlock}>
        <Text style={styles.title}>Profilim</Text>
        <Text style={styles.subtitle}>{user.email}</Text>
      </View>

      {loadingTasks ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>İstatistikler yükleniyor...</Text>
        </View>
      ) : (
        <>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategori Özeti</Text>

            <View style={styles.categoryStatsRow}>
              <View style={styles.categoryStatCard}>
                <Text style={styles.categoryStatNumber}>{workCount}</Text>
                <Text style={styles.categoryStatLabel}>Work</Text>
              </View>

              <View style={styles.categoryStatCard}>
                <Text style={styles.categoryStatNumber}>{personalCount}</Text>
                <Text style={styles.categoryStatLabel}>Personal</Text>
              </View>

              <View style={styles.categoryStatCard}>
                <Text style={styles.categoryStatNumber}>{studyCount}</Text>
                <Text style={styles.categoryStatLabel}>Study</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hızlı Erişim</Text>

            <Pressable
              style={styles.quickLinkCard}
              onPress={() => router.push('/tasks')}>
              <Text style={styles.quickLinkTitle}>Görevlerime Git</Text>
              <Text style={styles.quickLinkText}>
                Tüm görevlerini görüntüle, düzenle ve yönet.
              </Text>
            </Pressable>
          </View>

          <PrimaryButton title="Çıkış Yap" onPress={handleLogout} />
        </>
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
  centered: {
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
  headerBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 12,
  },
  categoryStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryStatCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  categoryStatNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  categoryStatLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
  quickLinkCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },
  quickLinkText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});