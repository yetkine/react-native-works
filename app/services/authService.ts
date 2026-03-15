import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase/config';

export const registerWithEmail = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) {
    throw new Error('E-posta ve şifre alanları boş bırakılamaz.');
  }

  if (password.length < 6) {
    throw new Error('Şifre en az 6 karakter olmalı.');
  }

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) {
    throw new Error('E-posta ve şifre alanları boş bırakılamaz.');
  }

  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};