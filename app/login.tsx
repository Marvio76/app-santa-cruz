import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LoginForm from '../components/ui/LoginForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      // CORREÇÃO 1: Mudamos de 'senha' para 'password' para o Backend entender
      const dadosParaApi = {
        email: credentials.email,
        password: credentials.password
      };

      const response = await axios.post(`${API_URL}/api/auth/login`, dadosParaApi);

      console.log('API respondeu com sucesso:', response.data);

      // Persistir token e usuário no dispositivo
      if (response?.data?.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }

      // CORREÇÃO 2: O Backend retorna 'user', não 'usuario'
      if (response?.data?.user) {
        await AsyncStorage.setItem('usuario', JSON.stringify(response.data.user));
      }

      router.replace('/(tabs)');

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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho de Boas-Vindas */}
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeText}>Bem vindo</Text>
          <Text style={styles.cityName}>Santa Cruz dos Milagres</Text>
        </View>

        {/* Imagem de Capa */}
        <Image
          source={require('../assets/images/SantaCruz.jpg')}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* Formulário de Login */}
        <View style={styles.formContainer}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  welcomeHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0027a6ff',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0027a6ff',
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginBottom: 30,
  },
  formContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20
  },
  footerText: {
    color: '#666',
    fontSize: 16
  },
  registerText: {
    color: '#0027a6ff',
    fontSize: 16,
    fontWeight: '600'
  },
  forgotPassword: {
    alignItems: 'center'
  },
  forgotPasswordText: {
    color: '#0027a6ff',
    fontSize: 16
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600'
  },
});
