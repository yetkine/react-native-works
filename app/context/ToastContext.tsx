import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);

  const showToast = (toastMessage: string, toastType: ToastType = 'info') => {
    setMessage(toastMessage);
    setType(toastType);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {visible && (
        <View
          style={[
            styles.toast,
            type === 'success' && styles.successToast,
            type === 'error' && styles.errorToast,
            type === 'info' && styles.infoToast,
          ]}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successToast: {
    backgroundColor: '#2e7d32',
  },
  errorToast: {
    backgroundColor: '#c62828',
  },
  infoToast: {
    backgroundColor: '#333',
  },
  toastText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});