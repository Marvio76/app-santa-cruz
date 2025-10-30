import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LoginForm from '../components/ui/LoginForm';

const API_URL = 'https://guia-santa-cruz-api.onrender.com';

export default function LoginScreen() {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (credentials: { email: string; password: string }) => {
    console.log('Tentando logar com:', credentials);
    setLoginError('');

    if (!credentials || !credentials.email || !credentials.password) {
      setLoginError('Email e senha são obrigatórios.');
      console.log('Dados recebidos inválidos:', credentials);
      return;
    }

    try {
      
      const dadosParaApi = {
        email: credentials.email,
        senha: credentials.password 
      };

      // Manda o objeto corrigido
      const response = await axios.post(`${API_URL}/api/auth/login`, dadosParaApi);
      
      console.log('API respondeu com sucesso:', response.data);
      const token = response.data.token;
      // TODO: Salvar o token (AsyncStorage)
      router.replace('/telaInicial');

    } catch (error: any) {
      console.error('Erro no login:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Erro inesperado ao tentar logar.';
      setLoginError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Bem vindo ao Guia Santa Cruz</Text>
          <Text style={styles.welcomeSubtitle}>Faça login para continuar</Text>
        </View>

        <LoginForm onLogin={handleLogin} />

        {loginError ? (
          <Text style={styles.errorText}>{loginError}</Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
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
  forgotPassword: { alignItems: 'center' },
  forgotPasswordText: { color: '#0027a6ff', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 15, marginBottom: 10, fontSize: 16, fontWeight: '600' },
});