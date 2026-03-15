import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

type CustomInputProps = TextInputProps;

export default function CustomInput(props: CustomInputProps) {
  return <TextInput style={styles.input} placeholderTextColor="#999" {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: 'black',
  },
});