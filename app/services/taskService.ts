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
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Task } from '../types/task';

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

export const addTaskToFirestore = async (title: string) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Önce giriş yapmalısın.');
  }

  if (!title.trim()) {
    throw new Error('Görev alanı boş bırakılamaz.');
  }

  await addDoc(collection(db, 'tasks'), {
    title,
    completed: false,
    userId: currentUser.uid,
    userEmail: currentUser.email || '',
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
