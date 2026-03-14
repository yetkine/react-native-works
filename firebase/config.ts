import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA3riI5oJTRivXz4Jue3ptYUT0trSvngD0',
  authDomain: 'react-native-works-1fb15.firebaseapp.com',
  projectId: 'react-native-works-1fb15',
  storageBucket: 'react-native-works-1fb15.firebasestorage.app',
  messagingSenderId: '152893817157',
  appId: '1:152893817157:web:26f0c55c3f7feb8faafe2c',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;