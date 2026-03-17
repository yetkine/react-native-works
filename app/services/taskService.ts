import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Task, TaskCategory } from '../types/task';
import { isPastDate, isValidDateFormat } from '../utils/dateValidation';

export const fetchUserTasks = async (): Promise<Task[]> => {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Task, 'id'>),
  }));
};

export const addTaskToFirestore = async (
  title: string,
  dueDate: string,
  category: TaskCategory
) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Önce giriş yapmalısın.');
  }

  if (!title.trim()) {
    throw new Error('Görev alanı boş bırakılamaz.');
  }

  if (dueDate && !isValidDateFormat(dueDate)) {
    throw new Error('Tarih formatı YYYY-MM-DD olmalıdır.');
  }

  if (dueDate && isPastDate(dueDate)) {
    throw new Error('Geçmiş bir tarih giremezsin.');
  }

  await addDoc(collection(db, 'tasks'), {
    title,
    completed: false,
    userId: currentUser.uid,
    userEmail: currentUser.email || '',
    dueDate: dueDate.trim(),
    category,
    createdAt: serverTimestamp(),
  });
};

export const deleteTaskFromFirestore = async (taskId: string) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

export const toggleTaskCompletedInFirestore = async (
  taskId: string,
  currentCompleted: boolean
) => {
  await updateDoc(doc(db, 'tasks', taskId), {
    completed: !currentCompleted,
  });
};

export const updateTaskTitleInFirestore = async (
  taskId: string,
  newTitle: string,
  dueDate: string,
  category: TaskCategory
) => {
  if (!newTitle.trim()) {
    throw new Error('Görev alanı boş bırakılamaz.');
  }

  if (dueDate && !isValidDateFormat(dueDate)) {
    throw new Error('Tarih formatı YYYY-MM-DD olmalıdır.');
  }

  if (dueDate && isPastDate(dueDate)) {
    throw new Error('Geçmiş bir tarih giremezsin.');
  }

  await updateDoc(doc(db, 'tasks', taskId), {
    title: newTitle,
    dueDate: dueDate.trim(),
    category,
  });
};

export const subscribeToUserTasks = (
  callback: (tasks: Task[]) => void
) => {
  const user = auth.currentUser;

  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Task, 'id'>),
    }));

    callback(tasks);
  });

  return unsubscribe;
};