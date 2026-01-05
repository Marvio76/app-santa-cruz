import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import RegisterForm from '../components/ui/RegisterForm';
import axios from 'axios';

const API_URL = 'https://guia-santa-cruz-api.onrender.com';

export default function RegisterScreen() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState('');

  const handleRegister = async (credentials: { nome: string; email: string; password: string }) => {
    console.log('Tentando cadastrar com:', credentials);
    setRegisterError('');

    if (!credentials || !credentials.nome || !credentials.email || !credentials.password) {
      setRegisterError('Nome, email e senha são obrigatórios.');
      console.log('Dados de cadastro recebidos inválidos:', credentials);
      return;
    }

    try {
      // CORREÇÃO AQUI: Trocado 'senha' por 'password' para bater com o Backend
      const dadosParaApi = {
        nome: credentials.nome,
        email: credentials.email,
        password: credentials.password
      };

      const response = await axios.post(`${API_URL}/api/auth/register`, dadosParaApi);

      console.log('API respondeu cadastro com sucesso:', response.data);

      Alert.alert('Sucesso!', 'Cadastro realizado. Faça o login para continuar.');
      router.push('/login');

    } catch (error: any) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Erro inesperado ao tentar cadastrar.';
      setRegisterError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Crie sua Conta</Text>
          <Text style={styles.welcomeSubtitle}>É rápido e fácil</Text>
        </View>

        <RegisterForm onRegister={handleRegister} />

        {registerError ? (
          <Text style={styles.errorText}>{registerError}</Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.registerText}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8faff' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  welcomeTitle: { fontSize: 32, fontWeight: 'bold', color: '#0027a6ff', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 16, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 20 },
  footerText: { color: '#666', fontSize: 16 },
  registerText: { color: '#0027a6ff', fontSize: 16, fontWeight: '600' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 15, marginBottom: 10, fontSize: 16, fontWeight: '600' },
});
